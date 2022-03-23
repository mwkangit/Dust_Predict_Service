import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential  # 신경망 모델 생성자함수
from tensorflow.keras.layers import Embedding, LSTM, GRU, Dense, Dropout
from tensorflow.keras.models import load_model  # 신경망 모델 파일 불러오기
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.callbacks import EarlyStopping  # 학습조기종료
import pymysql
import matplotlib.pyplot as plt
from tensorflow.keras.utils import to_categorical
from numpy import argmax
from flask import Flask, request
import json
import requests

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from sklearn.model_selection import train_test_split  # 학습용 따로 검증용 따로

# train/val dataset 분리
conn = pymysql.connect(host='localhost', port=1521, user='root', password='1234', db='cloud')
curs = conn.cursor(pymysql.cursors.DictCursor)

sql = "select * from weatherjoinpm"

# 데이터와 레이블 만들기
df_scaled = pd.read_sql_query(sql, conn).drop(['index', 'level_0'], axis=1).round(4)

window_size = 7  # 과거 7일치 데이터로 다음날 예측
TEST_SIZE = 100  # 3년중에 100일을 TEST데이터로 추출
train = df_scaled

# train = df_scaled[:-TEST_SIZE]
# test = df_scaled[-TEST_SIZE:]

def make_dataset(data, label, window_size):  # dataset만들어준다.
    feature_list = []
    label_list = []
    for i in range(len(data) - window_size - 1):
        feature_list.append(np.array(data.iloc[i:i + window_size]))
        label_list.append(np.array(label.iloc[i + window_size + 1]))
    return np.array(feature_list), np.array(label_list)

feature_cols = ['평균기온', '일강수량', '평균풍속', '평균이슬점온도', '평균상대습도', '평균현지기압', '평균해면기압',
                '평균전운량', '평균중하층운량', '월']
label_cols = ['PM']

train_feature = train[feature_cols]
train_label = train[label_cols]

# train dataset
train_feature, train_label = make_dataset(train_feature, train_label, window_size)
 # print(train_feature)
 # print(train_label)
# train, validation set 생성
from sklearn.model_selection import train_test_split
x_train, x_valid, y_train, y_valid = train_test_split(train_feature, train_label, test_size=0.1, shuffle=True)

y_train = to_categorical(y_train, 4)
y_valid = to_categorical(y_valid, 4)
# print(y_train.shape, y_valid.shape)

# test dataset (실제 예측 해볼 데이터)
# test_feature = test[feature_cols]
# test_label = test[label_cols]
# test_feature, test_label = make_dataset(test_feature, test_label, window_size)
# print(test_feature.shape, test_label.shape)

# 모델 생성
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.layers import LSTM

model = Sequential()
model.add(LSTM(7,
               input_shape=(train_feature.shape[1], train_feature.shape[2]),
               activation='relu',
               return_sequences=False)
          )
# model.add(LSTM(7,
#                activation='relu',
#                return_sequences=False)
#           )
model.add(Dense(4, activation='softmax'))

model_path = './AI_LAB-master'
filename = os.path.join(model_path, 'tmp_checkpoint.h5')

model.compile(loss='categorical_crossentropy', optimizer='adam',metrics=['accuracy'])

early_stop = EarlyStopping(monitor='val_loss', patience=5)
checkpoint = ModelCheckpoint(filename, monitor='val_loss', verbose=1, save_best_only=True, mode='auto')

model.summary()
history = model.fit(x_train, y_train,
                    epochs=200,
                    batch_size=32,
                    validation_data=(x_valid, y_valid),
                    callbacks=[checkpoint])
                    #callbacks=[early_stop, checkpoint])


# test
model.load_weights('C:/Users/HyungSu/Desktop/2021_2/pythonProject/AI_LAB-master/tmp_checkpoint.h5')

# 예측

pred = model.predict(x_valid)  # 7일치 데이터가 1개의 input으로 들어감
sum = 0
for i in argmax(pred,axis=1)==argmax(y_valid,axis=1):
    if(i):
        sum+=1
print(sum)
plt.figure(figsize=(12, 9))
plt.plot(argmax(y_valid,axis=1), label='actual')
plt.plot(argmax(pred, axis=1), label='prediction')
plt.legend()
plt.show()



