import pandas as pd
import numpy as np
import tensorflow
from flask import Flask, request
import json
import requests
from numpy import argmax
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Setup flask server
app = Flask(__name__)

@app.route('/pm', methods=['POST'])
def sum_of_array():
    input_list = []
    data = request.get_json()
    #print(data,'....')
    # 1. dataframe으로 만들기
    df = pd.DataFrame(data)
    df = df.replace('', '0.0')
    df = df.astype(float)
    #print(df)

    # 2. 정규화 생략
    # 3. 데이터셋 만들기 (1,7,10)
    input_list = np.array(df).reshape(-1,7,10)

    # 모델 생성
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
    from tensorflow.keras.layers import LSTM

    model = Sequential()
    model.add(LSTM(7,
                   input_shape=(input_list.shape[1], input_list.shape[2]),
                   activation='relu',
                   return_sequences=False)
              )
    # model.add(LSTM(7,
    #                activation='relu',
    #                return_sequences=False)
    #           )
    model.add(Dense(4, activation='softmax'))
    # test
    model.load_weights('C:/Users/HyungSu/Desktop/2021_2/pythonProject/AI_LAB-master/tmp_checkpoint.h5')

    # 예측
    input_list = tensorflow.convert_to_tensor(input_list, np.float32)
    pred = model.predict(input_list)  # 7일치 데이터가 1개의 input으로 들어감

    # Return data in json format
    return json.dumps({"result": int(argmax(pred, axis=1)[0])})

if __name__ == "__main__":
    app.run(port=5000)
    #app.run(host='117.16.137.115', port=5000)