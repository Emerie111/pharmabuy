import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime
import re
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Dict, List, Optional, Tuple

class NAFDACScraper:
    def __init__(self):
        self.base_url = "https://greenbook.nafdac.gov.ng"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        self.progress_file = 'scraping_progress.json'
        self.checkpoint_interval = 100
        self.current_progress = self.get_initial_progress()
        
        self.validation_log = {
            'missing_manufacturer': [],
            'missing_nafdac': [],
            'missing_strength': [],
            'missing_dosage_form': [],
            'retry_attempts': {}
        }

    def get_initial_progress(self):
        return {
            'last_saved_page': 0,
            'processed_ingredients': [],
            'processed_brands': [],
            'total_products': 0,
            'last_save_time': None,
            'failed_scrapes': []
        }

    def validate_product(self, product_data: Dict) -> Tuple[bool, List[str]]:
        required_fields = {
            'manufacturer': 'Manufacturer Name',
            'nafdacNumber': 'NAFDAC Registration Number',
            'brandName': 'Brand Name',
            'strength': 'Strength',
            'dosageForm': 'Dosage Form'
        }
        missing_fields = []
        for field, field_name in required_fields.items():
            if not product_data.get(field):
                missing_fields.append(field_name)
        return len(missing_fields) == 0, missing_fields

    def calculate_quality_score(self, product_data: Dict) -> float:
        required_fields = {
            'manufacturer': 0.25,
            'nafdacNumber': 0.25,
            'brandName': 0.15,
            'strength': 0.15,
            'dosageForm': 0.10,
            'packSize': 0.05,
            'countryOfOrigin': 0.05
        }
        score = 0.0
        for field, weight in required_fields.items():
            if product_data.get(field):
                score += weight
        return score

    def save_progress(self, products: List[Dict]):
        self.current_progress['last_save_time'] = datetime.now().isoformat()
        self.current_progress['total_products'] = len(products)
        
        with open(self.progress_file, 'w') as f:
            json.dump(self.current_progress, f, indent=2)
        
        products_with_scores = []
        for product in products:
            product['qualityScore'] = self.calculate_quality_score(product)
            products_with_scores.append(product)
        
        with open('nafdac_products.json', 'w', encoding='utf-8') as f:
            json.dump(products_with_scores, f, ensure_ascii=False, indent=2)
            
        with open('validation_log.json', 'w') as f:
            json.dump(self.validation_log, f, indent=2)

    def get_page(self, url: str, max_retries: int = 3) -> Optional[str]:
        for attempt in range(max_retries):
            time.sleep(random.uniform(1, 3))
            try:
                response = self.session.get(url)
                response.raise_for_status()
                return response.text
            except requests.RequestException as e:
                print(f"Error fetching {url} (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    return None
                time.sleep(2 ** attempt)
        return None

    def get_active_ingredients(self):
        all_ingredients = []
        page = self.current_progress['last_saved_page'] + 1
        
        while True:
            url = f"{self.base_url}/ingredients?page={page}"
            print(f"\nFetching ingredients page {page}...")
            content = self.get_page(url)
            if not content:
                break

            soup = BeautifulSoup(content, 'html.parser')
            ingredients_on_page = []
            
            for link in soup.find_all('a', href=re.compile(r'/ingredient/products/\d+')):
                ingredient_id = link['href'].split('/')[-1]
                ingredients_on_page.append({
                    'id': ingredient_id,
                    'name': link.text.strip()
                })
            
            if not ingredients_on_page:
                break
                
            all_ingredients.extend(ingredients_on_page)
            print(f"Found {len(ingredients_on_page)} ingredients on page {page}")
            
            next_page_link = soup.find('a', string='›') # Standard 'next' arrow
            if not next_page_link:
                 # Check for alternative next page link if the site uses different pagination markers
                next_page_link = soup.find('a', {'rel': 'next'}) 
            if not next_page_link:
                break
            page += 1
            self.current_progress['last_saved_page'] = page -1 # Update last successfully processed page
            
        return all_ingredients

    def get_brands_for_ingredient(self, ingredient_id):
        if ingredient_id in self.current_progress['processed_ingredients']:
            print(f"Skipping already processed ingredient {ingredient_id}")
            return []

        url = f"{self.base_url}/ingredient/products/{ingredient_id}"
        content = self.get_page(url)
        if not content:
            return []

        soup = BeautifulSoup(content, 'html.parser')
        brands = []
        
        for link in soup.find_all('a', href=re.compile(r'/products/details/\d+')):
            brand_id = link['href'].split('/')[-1]
            if brand_id in self.current_progress['processed_brands']:
                continue
            
            text_parts = link.text.strip().split('##')
            brand_name = text_parts[0].strip()
            details = text_parts[1].strip() if len(text_parts) > 1 else ''
            
            strength = ''
            dosage_form = ''
            if details:
                parts = details.split('**')
                if len(parts) > 1:
                    dosage_form = parts[0].strip()
                    strength = parts[1].strip()
            
            brands.append({
                'id': brand_id,
                'name': brand_name,
                'strength': strength,
                'dosageForm': dosage_form
            })
        
        # self.current_progress['processed_ingredients'].append(ingredient_id) # Mark ingredient as processed
        return brands

    def get_product_details(self, product_id: str, max_retries: int = 3) -> Optional[Dict]:
        for attempt in range(max_retries):
            product_data = self._scrape_product_details(product_id)
            if product_data:
                is_valid, missing_fields = self.validate_product(product_data)
                if missing_fields:
                    print(f"Product {product_id} missing fields: {', '.join(missing_fields)}")
                    for field in missing_fields:
                        if field == 'Manufacturer Name':
                            self.validation_log['missing_manufacturer'].append(product_id)
                        elif field == 'NAFDAC Registration Number':
                            self.validation_log['missing_nafdac'].append(product_id)
                        elif field == 'Strength':
                            self.validation_log['missing_strength'].append(product_id)
                        elif field == 'Dosage Form':
                            self.validation_log['missing_dosage_form'].append(product_id)
                return product_data
            
            if attempt < max_retries - 1:
                print(f"Retrying product {product_id} (attempt {attempt + 1}/{max_retries})")
                time.sleep(2 ** attempt)
                continue
            
            self.validation_log['retry_attempts'][product_id] = attempt + 1
            return None
        return None

    def _scrape_product_details(self, product_id: str) -> Optional[Dict]:
        url = f"{self.base_url}/products/details/{product_id}"
        content = self.get_page(url)
        if not content:
            return None

        soup = BeautifulSoup(content, 'html.parser')
        
        product_data = {
            'id': product_id,
            'brandName': '',
            'manufacturer': '',
            'nafdacNumber': '',
            'type': 'prescription', 
            'dateAdded': datetime.now().strftime('%Y-%m-%d'),
            'verified': True,
            'rating': 4.0,
            'bioequivalence': 'pending',
            'countryOfOrigin': 'Nigeria', # Default
            'strength': '',
            'dosageForm': '',
            'packSize': '',
            'image': '/placeholder.svg',
            'suppliers': []
        }

        def normalize(text):
            if not text:
                return ''
            return ' '.join(text.replace('\xa0', ' ').split())

        try:
            name_elem = soup.find('h1')
            if name_elem:
                product_data['brandName'] = normalize(name_elem.text)

            # --- NEW LOGIC: Extract manufacturer and country from <h1> and next <p> ---
            for h1 in soup.find_all("h1", class_="p-1 bg-gray-200 text-left"):
                label = h1.get_text(strip=True).lower()
                value_tag = h1.find_next_sibling("p")
                value = value_tag.get_text(strip=True) if value_tag else ""
                if "manufacturer name" in label:
                    product_data['manufacturer'] = value
                elif "manufacturer country" in label:
                    product_data['countryOfOrigin'] = value
                elif "nrn" in label or "registration number" in label:
                    product_data['nafdacNumber'] = value
                elif "packsize" in label or "pack size" in label:
                    product_data['packSize'] = value
                elif "strength" in label:
                    product_data['strength'] = value
                elif "dosage form" in label:
                    product_data['dosageForm'] = value
                elif "marketing category" in label:
                    category = value.lower()
                    product_data['type'] = 'otc' if 'otc' in category else 'prescription'

            # --- END NEW LOGIC ---

            # Existing fallback logic for other fields (if needed)
            detail_sections = soup.find_all('div', class_='detail-section')
            for section in detail_sections:
                title_tag = section.find('h3')
                if not title_tag:
                    continue
                title_text_original_normalized = normalize(title_tag.text) 
                title_text_lower = title_text_original_normalized.lower()
                value_text = ''
                detail_value_div = section.find('div', class_='detail-value')
                if detail_value_div:
                    value_text = normalize(detail_value_div.text)
                if not value_text:
                    potential_texts = []
                    for s in title_tag.find_next_siblings():
                        if isinstance(s, str):
                            norm_s = normalize(s)
                            if norm_s:
                                potential_texts.append(norm_s)
                                break 
                        elif s.name and s.name in ['p', 'span', 'div']:
                            norm_s = normalize(s.text)
                            if norm_s:
                                potential_texts.append(norm_s)
                                break 
                    if potential_texts:
                        value_text = potential_texts[0]
                    else:
                        stripped_texts_in_section = [normalize(t) for t in section.stripped_strings if normalize(t)]
                        try:
                            title_index = -1
                            for i, st in enumerate(stripped_texts_in_section):
                                if st.lower() == title_text_lower:
                                    title_index = i
                                    break
                            if title_index != -1 and title_index + 1 < len(stripped_texts_in_section):
                                value_text = stripped_texts_in_section[title_index + 1]
                        except ValueError:
                            pass
                if not value_text and ':' in title_text_original_normalized:
                    parts = title_text_original_normalized.split(':', 1)
                    if len(parts) > 1 and normalize(parts[1].strip()):
                        if any(keyword in title_text_lower for keyword in ['manufacturer name', 'company name', 'nrn', 'registration number', 'strength', 'dosage form', 'manufacturer country', 'country of origin', 'packsize']):
                            value_text = normalize(parts[1].strip())
                if any(x in title_text_lower for x in ['manufacturer name', 'company name', 'producer', 'produced by', 'manufactured by']):
                    if not product_data['manufacturer']:
                        product_data['manufacturer'] = value_text
                elif any(x in title_text_lower for x in ['nrn', 'registration number', 'reg. no', 'reg no', 'nafdac reg']):
                    if not product_data['nafdacNumber']:
                        product_data['nafdacNumber'] = value_text
                elif 'strength' in title_text_lower:
                    if not product_data['strength']:
                        product_data['strength'] = value_text
                elif 'dosage form' in title_text_lower:
                    if not product_data['dosageForm']:
                        product_data['dosageForm'] = value_text
                elif 'marketing category' in title_text_lower:
                    category = value_text.lower()
                    product_data['type'] = 'otc' if 'otc' in category else 'prescription'
                elif any(x in title_text_lower for x in ['manufacturer country', 'country of origin', 'country of manufacture', 'made in']):
                    if value_text and not product_data['countryOfOrigin']:
                        product_data['countryOfOrigin'] = value_text
                elif 'packsize' in title_text_lower or 'pack size' in title_text_lower:
                    if not product_data['packSize']:
                        product_data['packSize'] = value_text

            # Fallback for manufacturer if still not found by section parsing
            if not product_data['manufacturer']:
                brand_name = product_data['brandName']
                manufacturer_patterns = [
                    r'^([A-Z][A-Za-z\s.,\'&-]+)(?=\s+\d)',
                    r'^([A-Z][A-Za-z\s.,\'&-]+)(?=\s+(?:Tablet|Capsule|Suspension|Syrup|Injection|Cream|Ointment|Gel|Powder|Solution|Drops|Spray|Inhaler|Patch|Suppository|Enema|Aerosol))',
                    r'^([A-Z][A-Za-z\s.,\'&-]+)(?=\s+(?:mg|g|ml|IU|mcg|µg|%|w/v|w/w))',
                    r'^([A-Z][A-Za-z\s.,\'&-]+)(?=\s+(?:Plus|Extra|Forte|SR|XR|CR|MR|LA|DS))'
                ]
                for pattern in manufacturer_patterns:
                    manufacturer_match = re.search(pattern, brand_name)
                    if manufacturer_match:
                        potential_manufacturer = manufacturer_match.group(1).strip()
                        if len(potential_manufacturer) > 3 and (' ' in potential_manufacturer or potential_manufacturer.endswith(('.', 'Ltd', 'Inc', 'PLC'))):
                            product_data['manufacturer'] = potential_manufacturer
                            break
            if not product_data['strength'] or not product_data['dosageForm']:
                brand_name = product_data['brandName']
                strength_pattern = r'(\d+(?:\.\d+)?\s*(?:mg|g|ml|IU|mcg|µg|%|w/v|w/w)(?:\s*/\s*\d*\.?\d*\s*(?:ml|dose|actuation))?)'
                dosage_form_pattern = r'(tablet|capsule|suspension|syrup|injection|cream|ointment|gel|powder|solution|drops|spray|inhaler|patch|suppository|enema|aerosol|lozenge|granules|effervescent|oral liquid|oral solution|oral suspension|oral drops|oral powder|for injection|for solution|for suspension)'
                if not product_data['strength']:
                    strength_match = re.search(strength_pattern, brand_name, re.IGNORECASE)
                    if strength_match:
                        product_data['strength'] = strength_match.group(1)
                if not product_data['dosageForm']:
                    dosage_match = re.search(dosage_form_pattern, brand_name, re.IGNORECASE)
                    if dosage_match:
                        product_data['dosageForm'] = dosage_match.group(1).capitalize()

            print(f"\nProduct {product_id} details:")
            print(f"Brand Name: {product_data['brandName']}")
            print(f"Manufacturer: {product_data['manufacturer']}")
            print(f"NAFDAC Number: {product_data['nafdacNumber']}")
            print(f"Country: {product_data['countryOfOrigin']}")
            print(f"Strength: {product_data['strength']}")
            print(f"Dosage Form: {product_data['dosageForm']}")

        except Exception as e:
            print(f"[WARN] Error parsing product details for ID {product_id}: {e}")
            return None

        return product_data

    def scrape_all_products(self):
        all_products = []
        
        print("Fetching active ingredients...")
        ingredients = self.get_active_ingredients()
        print(f"Found {len(ingredients)} active ingredients")
        total_ingredients = len(ingredients)

        for idx, ingredient in enumerate(ingredients):
            # Skip if already processed (if implementing resume logic for ingredients)
            # if ingredient['id'] in self.current_progress['processed_ingredients']:
            #     print(f"\n[{idx+1}/{total_ingredients}] Skipping already processed ingredient: {ingredient['name']} (ID: {ingredient['id']})")
            #     continue

            print(f"\n[{idx+1}/{total_ingredients}] Processing ingredient: {ingredient['name']} (ID: {ingredient['id']})")
            brands = self.get_brands_for_ingredient(ingredient['id'])
            print(f"Found {len(brands)} brands for {ingredient['name']}")

            for bidx, brand in enumerate(brands):
                 # Skip if already processed (if implementing resume logic for brands)
                # if brand['id'] in self.current_progress['processed_brands']:
                #     print(f"  - [{bidx+1}/{len(brands)}] Skipping already processed brand: {brand['name']} (ID: {brand['id']})")
                #     continue

                print(f"  - [{bidx+1}/{len(brands)}] Fetching details for brand: {brand['name']} (ID: {brand['id']})")
                product_details = self.get_product_details(brand['id'])
                if product_details:
                    product_details['genericName'] = ingredient['name']
                    if brand['strength'] and not product_details['strength']: # Prioritize section-parsed, then brand list
                        product_details['strength'] = brand['strength']
                    if brand['dosageForm'] and not product_details['dosageForm']: # Prioritize section-parsed, then brand list
                        product_details['dosageForm'] = brand['dosageForm']
                    all_products.append(product_details)
                    self.current_progress['processed_brands'].append(brand['id']) # Mark brand as processed
                else:
                    print(f"    [WARN] Failed to scrape brand {brand['name']} (ID: {brand['id']})")
                    self.current_progress['failed_scrapes'].append(brand['id'])
            
            self.current_progress['processed_ingredients'].append(ingredient['id']) # Mark ingredient as processed after all its brands

            if (idx + 1) % 10 == 0 or (idx + 1) == total_ingredients : # Save every 10 ingredients or at the end
                print(f"\nSaving progress... ({len(all_products)} products scraped so far, {idx+1} ingredients processed)")
                self.save_progress(all_products) # Save all_products accumulated so far

        return all_products


def main():
    scraper = NAFDACScraper()
    # Basic resume logic (can be expanded)
    if os.path.exists(scraper.progress_file):
        load_progress = input("Found existing progress file. Resume? (y/n): ").lower()
        if load_progress == 'y':
            try:
                with open(scraper.progress_file, 'r') as f:
                    scraper.current_progress = json.load(f)
                print(f"Resuming from page {scraper.current_progress.get('last_saved_page', 0) + 1}")
                # Potentially load existing products if you want to append instead of restart product list
                # if os.path.exists('nafdac_products.json'):
                #     with open('nafdac_products.json', 'r', encoding='utf-8') as f:
                #         # This would require `scrape_all_products` to be able to append
                #         # For now, it restarts the product list but skips processed items
                #         pass 
            except Exception as e:
                print(f"Could not load progress file, starting fresh: {e}")
                scraper.current_progress = scraper.get_initial_progress() # Reset on error
        else:
            print("Starting fresh scrape...")
            scraper.current_progress = scraper.get_initial_progress() # Reset progress
    else:
        print("Starting fresh scrape...")

    products = scraper.scrape_all_products()
    print(f"\nScraped {len(products)} products in total (this run).")
    
    print("\nValidation Summary:")
    print(f"Products missing manufacturer: {len(scraper.validation_log['missing_manufacturer'])}")
    print(f"Products missing NAFDAC number: {len(scraper.validation_log['missing_nafdac'])}")
    print(f"Products missing strength: {len(scraper.validation_log['missing_strength'])}")
    print(f"Products missing dosage form: {len(scraper.validation_log['missing_dosage_form'])}")
    print(f"Total failed scrapes (could not retrieve details): {len(scraper.current_progress['failed_scrapes'])}")
    
    scraper.save_progress(products) # Final save with all products from this run
    print("\nSaved to JSON files")

if __name__ == "__main__":
    main()
