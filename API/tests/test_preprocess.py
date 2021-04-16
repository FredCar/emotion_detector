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