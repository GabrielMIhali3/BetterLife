import re

import requests
from bs4 import BeautifulSoup
from lxml import etree, html
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class ExtractPrice:
    def extract_price_carrefour(self, url):

        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.text, 'html.parser')

            # Gasim secțiunea product-info-price
            product_info_price = soup.find('div', class_='product-info-price')

            if product_info_price:
                # Gasim span-ul care conține prețul
                price_element = product_info_price.find('span', class_='price-wrapper')

                # Verificam dacă elementul a fost gasit
                if price_element and 'data-price-amount' in price_element.attrs:
                    # Extragem valoarea atributului data-price-amount
                    price_amount = price_element['data-price-amount']
                    return price_amount
                else:
                    print(
                        "Elementul cu clasa 'price-wrapper' nu a fost găsit sau nu conține atributul 'data-price-amount'.")
                    return None
            else:
                print("Secțiunea 'product-info-price' nu a fost găsită.")
                return None
        else:
            print(f"Nu s-a putut accesa pagina. Cod status HTTP: {response.status_code}")
            return None

    def extract_price_mega(self, url):
        # Configurăm optiunile pentru ChromeDriver
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")  # Ruleaza browserul în modul headless (fara interfata grafica)
        chrome_options.add_argument("--disable-gpu")

        driver = webdriver.Chrome(
            service=Service('chromedriver.exe'),
            options=chrome_options)

        try:
            # incarcam pagina web
            driver.get(url)

            # Așteptam până când elementul este prezent
            wait = WebDriverWait(driver, 10)
            price_section = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="product-block-price"]')))

            # Extragem textul complet din secțiune si eliminăm liniile noi
            full_price_text = price_section.text.replace('\n', ' ')

            # inlocuim spatiul dintre primele două numere cu un punct
            parts = full_price_text.split(' ')
            if len(parts) >= 3:
                full_price_text = f"{parts[0]}.{parts[1]}"

            return full_price_text
        except Exception as e:
            print(f"Elementul nu a fost găsit: {e}")
            return None
        finally:
            # inchidem browserul
            driver.quit()

    def extract_price_profi_kaufland(self, url):

        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.content, 'html.parser')

            # Gasim primul element cu clasa 'price-container' si apoi elementul 'price'
            price_container = soup.find('div', class_='price-container')

            if price_container:
                price_element = price_container.find('span', class_='price')
                if price_element:
                    # Extragem textul complet si eliminam liniile noi
                    full_price_text = price_element.get_text(strip=True)

                    # inlocuim spațiul dintre primele doua numere cu un punct
                    parts = full_price_text.split()
                    if len(parts) >= 2:
                        full_price_text = f"{parts[0]}"

                    return full_price_text.strip()
                else:
                    print("Elementul 'span' cu clasa 'price' nu a fost găsit.")
                    return None
            else:
                print("Elementul 'div' cu clasa 'price-container' nu a fost găsit.")
                return None
        else:
            print(f"Nu s-a putut accesa pagina. Cod status HTTP: {response.status_code}")
            return None

    def extract_price_auchan(self, url):

        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.content, 'html.parser')

            # Gasim primul element cu clasa 'price-container' si apoi elementul 'price'
            price_container = soup.find('div', class_='vtex-render__container-id-product-details')

            if price_container:
                price_element = price_container.find('span', class_='vtex-product-price-1-x-currencyContainer vtex-product-price-1-x-currencyContainer--pdp')
                if price_element:
                    # Extragem textul complet si eliminam liniile noi
                    full_price_text = price_element.get_text(strip=True)

                    # inlocuim virgula cu punct și adaugam un spațiu inainte de "Lei"
                    full_price_text = full_price_text.replace(',', '.').replace('lei', '')

                    return full_price_text.strip()
                else:
                    print("Elementul 'span' cu clasa 'price' nu a fost găsit.")
                    return None
            else:
                print("Elementul 'div' cu clasa 'price-container' nu a fost găsit.")
                return None
        else:
            print(f"Nu s-a putut accesa pagina. Cod status HTTP: {response.status_code}")
            return None

    # def extract_price_mega(self, url):
    #     # Configuram optiunile pentru ChromeDriver
    #     chrome_options = webdriver.ChromeOptions()
    #     chrome_options.add_argument("--headless")  # Rulează browserul în modul headless (fără interfață grafică)
    #     chrome_options.add_argument("--disable-gpu")
    #
    #     driver = webdriver.Chrome(
    #         service=Service('chromedriver.exe'),
    #         options=chrome_options)
    #
    #     try:
    #
    #         driver.get(url)
    #
    #         # Așteptam pana cand elementul este prezent
    #         wait = WebDriverWait(driver, 10)
    #         price_section = wait.until(
    #             EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="product-block-price"]')))
    #
    #         # Extragem textul complet din secțiune si eliminam liniile noi
    #         full_price_text = price_section.text.replace('\n', ' ')
    #
    #         # inlocuim spațiul dintre primele două numere cu un punct
    #         parts = full_price_text.split(' ')
    #         if len(parts) >= 3:
    #             full_price_text = f"{parts[0]}.{parts[1]} {parts[2]}"
    #
    #         return full_price_text
    #     except Exception as e:
    #         print(f"Elementul nu a fost găsit: {e}")
    #         return None
    #     finally:
    #         # Închidem browserul
    #         driver.quit()

    def extract_price_glovo(self, url):

        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.content, 'html.parser')

            # Gasim primul element cu clasa 'price-container' si apoi elementul 'price'
            price_element = soup.find('span', class_='product-price__effective product-price__effective--new-card')

            if price_element:

                # Extragem textul complet si eliminam liniile noi
                full_price_text = price_element.get_text(strip=True)

                # Înlocuirea tuturor tipurilor de spații (inclusiv NBSP) și eliminarea textului 'RON'
                full_price_text = full_price_text.replace('\u00A0', ' ').replace(' RON', '')

                # inlocuim virgula cu punct si adaugăm un spațiu inainte de "Lei"
                full_price_text = full_price_text.replace(',', '.')

                return full_price_text.strip()

            else:
                print("Elementul 'div' cu clasa 'price-container' nu a fost găsit.")
                return None
        else:
            print(f"Nu s-a putut accesa pagina. Cod status HTTP: {response.status_code}")
            return None

    def extract_nutrition_values(self, url):
        # conținutul paginii
        response = requests.get(url)

        # Verifică dacă cererea a fost executată cu succes
        if response.status_code == 200:

            soup = BeautifulSoup(response.content, 'html.parser')

            # Gasește tabelul cu aria-label "Valori nutritionale"
            table = soup.find('table', {'aria-label': 'Valori nutriționale'})

            if table:
                # Extrage randurile din tabel
                rows = table.find_all('tr')
                nutrition_values = {}

                cols = rows[1].find_all('td')
                value_per_100g = cols[1].get_text(strip=True)
                return value_per_100g

            else:
                return 'Tabelul specificat nu a fost găsit.'
        else:
            return f'Nu s-a putut accesa pagina. Status code: {response.status_code}'

    def extract_first_specification_value(self, url):
        # conținutul paginii
        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.content, 'html.parser')

            # Gaseste toate elementele cu clasa specificata
            elements = soup.find_all('div',
                                     class_="flex mt0 mb0 pt0 pb0 justify-start vtex-flex-layout-0-x-flexRowContent vtex-flex-layout-0-x-flexRowContent--specification items-stretch w-100")

            if len(elements) > 1:
                informatii_nutritionale = elements[1]

                # Gasește primul element cu clasa specificata in informatii_nutritionale
                specification_value = informatii_nutritionale.find_all('span',
                                                                   class_="vtex-product-specifications-1-x-specificationValue vtex-product-specifications-1-x-specificationValue--first vtex-product-specifications-1-x-specificationValue--last")

                if len(specification_value) > 1:
                    # Returnează textul din elementul găsit
                    return specification_value[1].get_text(strip=True)
                else:
                    return 'Elementul specificat nu a fost găsit în informatii_nutritionale.'
            else:
                elements = soup.find_all('div',
                                         class_="flex mt0 mb0 pt0 pb0    justify-start vtex-flex-layout-0-x-flexRowContent vtex-flex-layout-0-x-flexRowContent--specification items-stretch w-100")
                if len(elements) > 1:
                    informatii_nutritionale = elements[1]

                    # Gaseste primul element cu clasa specificata in informatii_nutritionale
                    specification_value = informatii_nutritionale.find_all('span',
                                                                           class_="vtex-product-specifications-1-x-specificationValue vtex-product-specifications-1-x-specificationValue--first vtex-product-specifications-1-x-specificationValue--last")

                    if len(specification_value) > 1:
                        # Returnează textul din elementul gasit
                        return specification_value[1].get_text(strip=True)
                else:
                    return 'Elementul specificat nu a fost găsit în informatii_nutritionale.'


                return 'Nu există suficiente elemente pe pagina specificată.'
        else:
            return f'Nu s-a putut accesa pagina. Status code: {response.status_code}'
    def extract_kcal(self, url):
        text = self.extract_nutrition_values(url)
        # Folosim o expresie regulată pentru a gasi textul din paranteze
        match = re.search(r'\((\d+\s*kcal)\)', text)
        if match:
            return match.group(1)
        else:
            return None

    def extract_weight_from_url(self, url):
        # Folosim o expresie regulată pentru a găsi un număr urmat de litera "g"
        match = re.search(r'-(\d+)-g/p', url)
        if match:
            return match.group(1)  # Returnăm numărul găsit
        else:
            match = re.search(r'-(\d+)g/p', url)
            if match:
                return match.group(1)
            return None

# Exemplu de utilizare
# url = 'https://www.auchan.ro/iaurt-cu-cirese-muller-cremos-500-g/p'
# ex = ExtractPrice()
# print(ex.extract_first_specification_value(url))

# Exemplu de utilizare
# ex = ExtractPrice()
# url = 'https://glovoapp.com/ro/ro/bucuresti/kaufland-buc?content=ciocolata-c.255861186&search=https%3A%2F%2Fwww.auchan.ro%2Fpraline-chokotoff-238g%2Fp'  # Înlocuiește cu URL-ul real al paginii
# price_text = ex.extract_price_glovo(url)
#
# if price_text:
#     print(f"Prețul complet al produsului este: {price_text}")

# ex = ExtractPrice()
# url = 'https://www.auchan.ro/iaurt-cu-cirese-muller-cremos-500-g/p'
# print(ex.extract_weight_from_url(url))

