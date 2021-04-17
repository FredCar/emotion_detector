from googletrans import Translator
from transformers import BertTokenizer

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.classes import Preprocess

def test_Preprocess_class_init():
    p = Preprocess()
    assert type(p) == Preprocess
    assert type(p.translator) == Translator
    assert type(p.tokenizer) == BertTokenizer


def test_translate_function():
    p = Preprocess()
    sent = "Bonjour tout le monde"
    result = p.translate(sent)
    assert result == "Hello everybody"


def test_googletranslate_api_disponibility():
    t = Translator()
    assert type(t) == Translator

    sent = "Bonjour tout le monde"
    result = t.translate(sent, dest="en")
    assert result.origin == sent
    assert result.dest == "en"
    assert result.text != sent
    assert result.src == "fr"


def test_tokenize_function():
    p = Preprocess()
    sents = ["Je vais à la plage", "Bonjour tout le monde"]
    result = p.tokenize(sents)
    assert len(result) == 2
    assert list(result[0].keys()) == ['input_ids', 'token_type_ids', 'attention_mask']