from googletrans import Translator
from transformers import BertTokenizer
from googletrans import Translator

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.functions import Preprocess

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


def test_tokenize_function():
    p = Preprocess()
    sents = ["Je vais à la plage", "Bonjour tout le monde"]
    result = p.tokenize(sents)
    assert len(result) == 2
    assert list(result[0].keys()) == ['input_ids', 'token_type_ids', 'attention_mask']