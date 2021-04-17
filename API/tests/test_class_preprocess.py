from googletrans import Translator
from transformers import BertTokenizer

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.classes import Preprocess


PREPROCESS = ""
SENT = "Bonjour tout le monde"
SENTS = ["Je vais à la plage", "Bonjour tout le monde"]


def test_Preprocess_class_init():
    global PREPROCESS
    PREPROCESS = Preprocess()
    assert type(PREPROCESS) == Preprocess
    assert type(PREPROCESS.translator) == Translator
    assert type(PREPROCESS.tokenizer) == BertTokenizer


def test_translate_function():
    result = PREPROCESS.translate(SENT)
    assert result == "Hello everybody"


def test_googletranslate_api_disponibility():
    t = Translator()
    assert type(t) == Translator

    result = t.translate(SENT, dest="en")
    assert result.origin == SENT
    assert result.dest == "en"
    assert result.text != SENT
    assert result.src == "fr"


def test_tokenize_function():
    result = PREPROCESS.tokenize(SENTS)
    assert len(result) == 2
    assert list(result[0].keys()) == ['input_ids', 'token_type_ids', 'attention_mask']