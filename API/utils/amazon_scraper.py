from selenium import webdriver
from bs4 import BeautifulSoup as bs
import time
import re

options=webdriver.FirefoxOptions()
options.add_argument('-headless')
options.add_argument('-nosandbox')
options.add_argument('-disable-dev_shm_usage')

driver = webdriver.Firefox(executable_path='/src/utils/web_driver/geckodriver', options=options)

url = "https://www.amazon.fr/Jour-dapr%C3%A8s-Philippe-Villiers/product-reviews/222646199X/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"


def amazon_scraper(url=url):
    all_reviews = ""

    driver.get(url)
    time.sleep(1)

    rest_of_data = True
    while rest_of_data:
        try:
            next_link = driver.find_element_by_class_name("a-last")
            next_link = next_link.find_element_by_tag_name("a")
            next_link = next_link.get_attribute("href")
        except:
            rest_of_data = False

        reviews = driver.find_elements_by_class_name("review-text-content")
        for review in reviews:
            all_reviews += f"{review.text}<END>"

        if rest_of_data:
            driver.get(next_link)        
        time.sleep(1)

    driver.quit()
    return all_reviews



if __name__ == "__main__":
    all_reviews = amazon_scraper()
    all_reviews = all_reviews.split("<END>")
    i = 0
    for review in all_reviews:
        print(f"== {i} =============")
        print(review)

        i += 1
    
    print("========================")
    print(f"  Nb of comments : {len(all_reviews)}")
    print("========================")