from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup as bs
import time
import re

options=webdriver.FirefoxOptions()
options.add_argument('-headless')
options.add_argument('-nosandbox')
options.add_argument('-disable-dev_shm_usage')

driver = webdriver.Firefox(executable_path='/src/utils/web_driver/geckodriver', options=options)


def airbnb_scraper(url):
    # TODO Aller chercher le lien des commentaires depuis la page principale de l'annoce
    driver.get(url)
    time.sleep(5)
    dialog = driver.find_element_by_class_name("_1v5ksyp")

    nb_comments = dialog.find_element_by_class_name("_14i3z6h").text
    nb_comments = int(nb_comments[6:8]) # TODO Improve this using Regex to find number

    while True:
        dialog.send_keys(Keys.END)
        comments = driver.find_elements_by_class_name("_1gjypya")
        if len(comments) >= nb_comments:
            break
        time.sleep(0.5)

    title = driver.title
    html = driver.page_source
    soupe = bs(html, "html.parser")

    comments = soupe.find_all("div", {"class": "_1gjypya"})

    all_comments = ""
    for c in comments:
        try:
            comment = c.find("span").text
            all_comments += f"{comment}<END>"
        except:
            print("ERROR : comment >>> ", c)

    driver.quit()
    return all_comments, title



if __name__ == "__main__":
    url_test = "https://www.airbnb.fr/rooms/24277412/reviews?federated_search_id=1ca648aa-c654-458f-90b9-3204f1f2872f&source_impression_id=p3_1619175860_c1wLdsytxVIKViXc&guests=1&adults=1"

    all_comments = airbnb_scraper(url_test)
    all_comments = all_comments.split("<END>")
    i = 0
    for review in all_comments:
        print(f"== {i} =============")
        print(review)

        i += 1
    
    print("========================")
    print(f"  Nb of comments : {len(all_comments)}")
    print("========================")