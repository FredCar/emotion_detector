# from googletrans import Translator
# from transformers import BertTokenizer

import re
import numpy as np
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.classes import Model, Preprocess

MODEL_PATH = "model/bert_model.h5"

def test_Model_class_init():
    m = Model(path=MODEL_PATH)
    assert type(m) == Model


def test_load_model():
    assert 1 == 2


def test_predict_function():
    p = Preprocess()
    sents = ["Je vais à la plage", "Bonjour tout le monde", "Je suis content"]
    
    translated_sents = []
    for sent in sents:
        translated_sents.append(p.translate(sent))
    tokens_list = p.tokenize(translated_sents)
    
    m = Model(path=MODEL_PATH)
    result = m.predict(tokens_list)
    assert type(result) == list
    assert len(result) == len(sents)


def test_best_result_function():
    p = Preprocess()
    sents = ["Je vais à la plage", "Bonjour tout le monde", "Je suis content"]
    
    translated_sents = []
    for sent in sents:
        translated_sents.append(p.translate(sent))
    tokens_list = p.tokenize(translated_sents)
    
    m = Model(path=MODEL_PATH)
    preds_list = m.predict(tokens_list)
    result = m.best_result(preds_list)
    assert result in m.emotions


def test_detailled_results_function():
    p = Preprocess()
    sents = ["Je vais à la plage", "Bonjour tout le monde", "Je suis content"]
    
    translated_sents = []
    for sent in sents:
        translated_sents.append(p.translate(sent))
    tokens_list = p.tokenize(translated_sents)
    
    m = Model(path=MODEL_PATH)
    preds_list = m.predict(tokens_list)

    result = m.detailed_results(preds_list, sents)
    assert type(result) == dict
    assert len(result.keys()) == len(sents)
