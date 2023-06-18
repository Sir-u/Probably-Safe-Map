import pandas as pd


def find_closest_grid(latitude, longitude):
   # 격자 정보가 담긴 데이터프레임을 불러옵니다.
   # grid_data.csv 파일은 격자 정보가 포함된 데이터 파일입니다.
   grid_data = pd.read_csv('grid_data.csv')

   # 입력한 위도와 경도와의 거리를 계산하는 함수를 정의합니다.
   def distance(lat1, lon1, lat2, lon2):
      return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5

   # 가장 가까운 초(1/100) 값을 찾기 위한 초기값 설정
   closest_latitude = None
   closest_longitude = None
   closest_distance = float('inf')  # 무한대로 초기화

   # 데이터프레임을 순회하며 가장 가까운 초(1/100) 값을 찾습니다.
   for index, row in grid_data.iterrows():
      grid_latitude = row['Latitude']
      grid_longitude = row['Longitude']
      d = distance(latitude, longitude, grid_latitude, grid_longitude)

      if d < closest_distance:
         closest_latitude = grid_latitude
         closest_longitude = grid_longitude
         closest_distance = d

   # 가장 가까운 초(1/100) 값의 행을 찾아 격자 X 좌표와 격자 Y 좌표를 출력합니다.
   closest_row = grid_data[(grid_data['Latitude'] == closest_latitude) & (
      grid_data['Longitude'] == closest_longitude)]
   grid_x = closest_row['Grid_X'].values[0]
   grid_y = closest_row['Grid_Y'].values[0]
   print(f"격자 X 좌표: {grid_x}, 격자 Y 좌표: {grid_y}")


# 사용 예시
latitude = 37.123456  # 입력한 위도 값
longitude = 127.987654  # 입력한 경도 값
find_closest_grid(latitude, longitude)
