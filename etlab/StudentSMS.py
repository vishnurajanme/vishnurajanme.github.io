#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException
import time


BASE_URL = "https://sahrdaya.etlab.in"

#Change these
USERNAME = "Your Username"
PASSWORD = "Your Password"

#Change the number at the end to match your batch. Get it from ETLab
ATTENDANCE_URL = f"{BASE_URL}/ktuacademics/batch/viewattendance/23"

chrome_options = Options()
chrome_options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=chrome_options)
wait = WebDriverWait(driver, 20)

def login_if_needed():
    try:
        if "login" in driver.current_url or "LoginForm_username" in driver.page_source:
            username_field = wait.until(EC.presence_of_element_located((By.ID, "LoginForm_username")))
            password_field = driver.find_element(By.ID, "LoginForm_password")
            login_button = driver.find_element(By.NAME, "yt0")
            username_field.clear()
            username_field.send_keys(USERNAME)
            password_field.clear()
            password_field.send_keys(PASSWORD)
            login_button.click()
            wait.until(lambda d: "dashboard" in d.current_url or "viewattendance" in d.current_url)
            print("Login successful")
        else:
            print("Already logged in")
    except Exception as e:
        print("Login failed:", e)
        driver.quit()
        exit(1)

def click_eod_button():
    try:
        driver.get(ATTENDANCE_URL)
        time.sleep(2)
        print("Opened attendance page")
        button = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//a[contains(., 'EOD') and contains(., 'Send Absentees SMS')]"
        )))
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(1)
        button.click()
        print("EOD button clicked")
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print("Alert detected:", alert.text)
            alert.accept()
            print("Alert accepted")
        except TimeoutException:
            print("No alert appeared")
    except TimeoutException:
        print("EOD button not found or already sent")
    except UnexpectedAlertPresentException:
        try:
            alert = driver.switch_to.alert
            print("Unexpected alert:", alert.text)
            alert.accept()
            print("Alert accepted (unexpected)")
        except:
            print("Failed to handle unexpected alert")
    except Exception as e:
        print("Failed to click EOD button:", e)

try:
    print("Opening ETLab...")
    driver.get(ATTENDANCE_URL)
    login_if_needed()
    click_eod_button()
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    screenshot_path = f"etlab_eod_{timestamp}.png"
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot saved: {screenshot_path}")
except Exception as e:
    print("Unexpected error:", e)
finally:
    print("Closing browser...")
    time.sleep(5)
    driver.quit()
    print("Done")
