import requests

SERVER = 'http://localhost:3000'

# Erstellen
create_response = requests.post(f'{SERVER}/api/geotags', json={
    'latitude': 49.0139,
    'longitude': 8.4043,
    'name': 'Karlsruhe',
    'hashtag': '#city'
})
print('Create Response:', create_response.json())
created_route = create_response.headers['Location']
print('Created Route:', created_route)

# Auslesen
read_response = requests.get(SERVER + created_route)
print('Read Response:', read_response.json())

# Ändern
update_response = requests.put(SERVER + created_route, json={
    'latitude': 49.0139,
    'longitude': 8.4043,
    'name': 'Karlsruhe Updated',
    'hashtag': '#city'
})
print('Update Response:', update_response.json())

# Suchen
search_response = requests.get(f'{SERVER}/api/geotags', params={
    'searchterm': 'Karlsruhe'
})
print('Search Response:', search_response.json())

# Löschen
delete_response = requests.delete(SERVER + created_route)
print('Delete Response:', delete_response.json())

# Suchen (Nochmal)
search_response = requests.get(f'{SERVER}/api/geotags', params={
    'searchterm': 'Karlsruhe'
})
print('Search Response:', search_response.json())