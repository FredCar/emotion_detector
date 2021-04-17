from transformers import TFBertForSequenceClassification
import re
import numpy as np
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.classes import Model, Preprocess


MODEL_PATH = "model/bert_model.h5"
SENTS = ["Je vais à la plage", "Bonjour tout le monde", "Je suis content"]
# We will load our classes in this golabal varaibles to avoid to reload its in each test
MODEL = "" 
PREPROCESS = ""
PREDS_LIST = ""

def test_Model_class_init():
    global MODEL
    MODEL = Model(path=MODEL_PATH)
    assert type(MODEL) == Model
    assert type(MODEL.model) == TFBertForSequenceClassification


def test_predict_function():
    global PREPROCESS
    global PREDS_LIST
    PREPROCESS = Preprocess()
    
    translated_sents = []
    for sent in SENTS:
        translated_sents.append(PREPROCESS.translate(sent))
    tokens_list = PREPROCESS.tokenize(translated_sents)
    
    PREDS_LIST = MODEL.predict(tokens_list)
    result = PREDS_LIST
    assert type(result) == list
    assert len(result) == len(SENTS)


def test_best_result_function():    
    result = MODEL.best_result(PREDS_LIST)
    assert result in MODEL.emotions


def test_detailled_results_function():    
    result = MODEL.detailed_results(PREDS_LIST, SENTS)
    assert type(result) == dict
    assert len(result.keys()) == len(SENTS)
