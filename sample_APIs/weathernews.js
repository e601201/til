const city = 'Tokyo';  // 取得したい都市の名前
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.520002&longitude=13.41&hourly=temperature_2m&timezone=Asia%2F${city}`;
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // 取得したデータを表示
    console.log('都市:', data.timezone);

    // 時間と気温の配列を取り出す
    const timeArray = data.hourly.time;
    const temperatureArray = data.hourly.temperature_2m;

    // 配列をfor文で１つずつ取り出して表示
    for (let i = 0; i < timeArray.length; i++) {
      console.log('時間:', timeArray[i]);
      console.log('気温:', temperatureArray[i]);
    }
  })
  .catch(error => {
    console.error('データの取得に失敗しました:', error);
  });
