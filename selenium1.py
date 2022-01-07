from selenium import webdriver  #pip install selenium
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager #pip install webdriver_manager
from selenium.webdriver.common.by import By
import time
s=Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=s)
driver.maximize_window()
driver.get('http://10.1.1.9:3000/')
# driver.find_element(By.id, 'txt_username').send_keys('0')

text_area = driver.find_element_by_id('txt_username')
text_area.send_keys("0")

text_area1 = driver.find_element_by_id('txt_password')
text_area1.send_keys("0")

time.sleep(3)

text_area2 = driver.find_element_by_id('txt_login')
text_area2.click()

time.sleep(3)

driver.get('http://10.1.1.9:3000/remainingPO')

a=["CO","engine","transmission","other-parts"]
#b=["2.1481.059.2","I6.IX401.00.0","6.GP400.21.2","6.EE302.25.2"]
b=["y","y","y","y"]
for i in range(100):
    print(i)
    t=i%4
    t1=i%4
    time.sleep(1)
    text_area4 = driver.find_element_by_id('ddl_page')
    text_area4.send_keys(a[t])

    time.sleep(1)
    text_area5 = driver.find_element_by_id('txt_poid')
    text_area5.send_keys(b[t1])
    driver.find_element_by_id('search_btn').click()

    time.sleep(1)
    text_area5 = driver.find_element_by_id('txt_poid')
    text_area5.clear()
    driver.find_element_by_id('search_btn').click()

time.sleep(10)
