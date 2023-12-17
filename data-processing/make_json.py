import pandas as pd
import geopandas as gpd

# # Found on https://data.cityofnewyork.us/Transportation/Traffic-Volume-Counts/btm5-ppia
# df = pd.read_csv("data-processing/raw-data/Automated_Traffic_Volume_Counts_20231212.csv", usecols=columns)
# print("Reading done")

# Write smaller dataset to smaller file because 3GB is too much 
# df.to_csv('traffic_volume_snipped.csv', index=False)
# print("Intermediate csv made") 

# https://data.cityofnewyork.us/Transportation/Automated-Traffic-Volume-Counts/7ym2-wayt
# df = pd.read_csv("data-processing/raw-data/traffic_volume_snipped.csv")
# df.columns = ['year', 'month', 'day', 'volume', 'coords']

# # Combine D, M, Y into date column
# # df.rename(columns = {'Yr':'year', 'M':'month', 'D':'day'}, inplace=True)
# df['Date'] = pd.to_datetime(df[['year', 'month', 'day']])

# # Drop the original 'day', 'month', 'year' columns if needed
# df = df.drop(['day', 'month', 'year'], axis=1)

# # Sum traffic flow per location and per day 
# summed_df = df.groupby(['coords', 'Date']).sum().reset_index()

# df.to_csv('traffic_volume_snipped.csv', index=False)
# print("snipped again")

# Process in chunks due to the large dataset
# chunk_size = 10000
# chunks = pd.read_csv('data-processing/raw-data/traffic_volume_snipped.csv', chunksize=chunk_size)

# real_x_coords = [-74.260380, -73.699206]
# real_y_coords = [40.477211, 40.917691]
# orig_x_coords = [912287.068792, 1067382.508458]
# orig_y_coords = [113279.346998, 273617.843214]
# m_x = interp1d(orig_x_coords, real_x_coords)
# m_y = interp1d(orig_y_coords, real_y_coords)

# result_chunks = []

# for chunk in chunks:
#     # Extract latitude and longitude using regex
#     gdf = gpd.GeoDataFrame(chunk, geometry=gpd.GeoSeries.from_wkt(chunk['coords']))
#     chunk['latitude'] = m_y(gdf.geometry.y)
#     chunk['longitude'] = m_x(gdf.geometry.x)
#     chunk = chunk.rename(columns={'Date': 'date'})
#     result_chunks.append(chunk[['date', 'latitude', 'longitude', 'volume']])
# result_df = pd.concat(result_chunks, ignore_index=True)

# result_df.to_csv('data-processing/raw-data/location_volume.csv')

# columns = ['date', 'latitude', 'longitude','volume']
# chunk_size = 10000
# chunks = pd.read_csv('data-processing/raw-data/location_volume.csv', usecols=columns, chunksize=chunk_size)
# result_chunks = []

# for chunk in chunks:
#     chunk['date'] = pd.to_datetime(chunk['date'])
#     filtered_df = chunk[chunk['date'].dt.year == 2011]   
#     filtered_df = filtered_df.drop(columns=['date'])
#     df = filtered_df.groupby(['latitude', 'longitude'], as_index=False)['volume'].sum()
#     result_chunks.append(df)
# result_df = pd.concat(result_chunks, ignore_index=True)
# result_df.to_csv('data-processing/raw-data/location_volume2.csv')


# df = pd.read_csv('data-processing/raw-data/location_volume2.csv')
# df.to_json('data/location_volume.json', orient='records', default_handler=str)

chunk_size = 100000
columns = ['CRASH DATE', 'LATITUDE', 'LONGITUDE']
chunks = pd.read_csv('data-processing/Motor_Vehicle_Collisions.csv', chunksize=chunk_size, usecols=columns)
result_chunks = []


for chunk in chunks:
    chunk['CRASH DATE'] = pd.to_datetime(chunk['CRASH DATE'])
    df = chunk[chunk['CRASH DATE'].dt.year == 2018]   
    df = df.drop(columns=['CRASH DATE'])
    result_chunks.append(df)
    print("chunk done")
result_df = pd.concat(result_chunks, ignore_index=True)

result_df['accidents'] = ''
# df.groupby(['LATITUDE','LONGITUDE']).size().reset_index(name='accidents')
df = result_df.groupby(['LATITUDE', 'LONGITUDE'], as_index=False)['accidents'].count()
df.to_json("data/accidents2018.json", orient='records')

