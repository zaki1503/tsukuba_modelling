import requests
from bs4 import BeautifulSoup
import csv

# specify the URL of the website to be scraped
url = "https://fastestlaps.com/tracks/tsukuba"

# send a request to the website and get the HTML content
response = requests.get(url)
html_content = response.content

# parse the HTML content using BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# find the table containing lap times
table = soup.find('table', class_='table-striped')

if table:
    # extract the table headers
    headers = [th.text for th in table.select('tr th')]

    # extract the table rows
    rows = []
    for tr in table.select('tr')[1:]:
        row = [td.text.strip() for td in tr.select('td')]
        rows.append(row)

    # write the data to a CSV file
    file_path = (r'C:\Users\Zaki Ahmed\Documents\Tsukuba\tsukuba_modelling\data\tsukuba_lap_times.csv')
    with open(file_path, mode='w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(headers)
        writer.writerows(rows)
        
    print("Data saved to tsukuba_lap_times.csv at: " + file_path)
else:
    print("Table not found")