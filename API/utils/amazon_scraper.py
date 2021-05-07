from selenium import webdriver
import time
import re
import random
from http_request_randomizer.requests.proxy.requestProxy import RequestProxy

req_proxy = RequestProxy() #you may get different number of proxy when  you run this at each time
proxies = req_proxy.get_proxy_list() #this will create proxy lis

index = random.randint(0, len(proxies))
PROXY = proxies[index].get_address()

options = webdriver.FirefoxOptions()
options.add_argument('-headless')
options.add_argument('-nosandbox')
options.add_argument('-disable-dev_shm_usage')
options.add_argument(f'--proxy-server={PROXY}')

driver = webdriver.Firefox(executable_path='/src/utils/web_driver/geckodriver', options=options)


def amazon_scraper(url):
    all_reviews = ""

    driver.get(url)
    time.sleep(1)

    title = driver.title

    rest_of_data = True
    nb_review = 0
    # TODO Raise the limitation of number
    while rest_of_data and nb_review < 2:
        reviews = []
        try:
            next_link = driver.find_element_by_class_name("a-last")
            next_link = next_link.find_element_by_tag_name("a")
            next_link = next_link.get_attribute("href")
        except:
            rest_of_data = False

        # Try to find the translation made by Amazon
        reviews = driver.find_elements_by_class_name("cr-translated-review-content")
        if len(reviews) == 0:
            reviews = driver.find_elements_by_class_name("review-text-content")

        for review in reviews:
            all_reviews += f"{review.text}<END>"
            nb_review += 1

        if rest_of_data:
            driver.get(next_link)        
        time.sleep(1)

    driver.quit()
    return all_reviews, title



if __name__ == "__main__":
    url_test = "https://www.amazon.fr/Jour-dapr%C3%A8s-Philippe-Villiers/product-reviews/222646199X/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"

    all_reviews = amazon_scraper(url_test)
    all_reviews = all_reviews.split("<END>")
    i = 0
    for review in all_reviews:
        print(f"== {i} =============")
        print(review)

        i += 1
    
    print("========================")
    print(f"  Nb of comments : {len(all_reviews)}")
    print("========================")