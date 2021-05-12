import re
import random
import time
import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer
from googletrans import Translator
from http_request_randomizer.requests.proxy.requestProxy import RequestProxy


req_proxy = RequestProxy()
proxies = req_proxy.get_proxy_list()
index = random.randint(0, len(proxies))
PROXY = proxies[index].get_address()


class Preprocess:
    def __init__(self):
        self.translator = Translator(raise_exception=False, proxies={"http": PROXY})
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)

        print("==================================")
        print("\t TOKENIZER LOADED")
        print("==================================")


    def clean(self, original_text):
        quotes = ["'", '"']
        if original_text[0] in quotes:
            original_text = original_text[1:]
        if original_text[-1] in quotes:
            original_text = original_text[:-1]

        if original_text[-1] == ".":
            original_text = original_text[:-1]

        clean_text = original_text

        return clean_text


    def translate(self, reviews):
        google_max_len = 5000

        # If the length of review is short
        if sum([len(i) for i in reviews]) < google_max_len:
            reviews = "<END>".join(reviews)
            translated = self.translator.translate(reviews, dest="en").text
            translated = re.split("<END>|<END >|< END >|< END>", translated)
            return translated
        
        # If the length is too long for Google restriction
        to_translate = []
        translations = ""
        for review in reviews:
            total = sum([len(i) for i in to_translate]) + len(review)
            if total > google_max_len:
                translations += self.translator.translate("<END>".join(to_translate), dest="en").text + "<END>"
                to_translate = []

            to_translate.append(review)
        
        translations += self.translator.translate("<END>".join(to_translate), dest="en").text + "<END>"

        translated = re.split("<END>|<END >|< END >|< END>", translations)[:-1]
        return translated


    def tokenize(self, sents):
        tokens_list = []
        for sent in sents:
            tokenized = self.tokenizer.encode_plus(
                sent,
                add_special_tokens = True,
                max_length = 150,
                pad_to_max_length = True, 
                return_attention_mask = True
            )
            tokens_list.append(tokenized)

        return tokens_list



class Model:
    def __init__(self, path="/src/model/bert_model.h5"):
        self.emotions = {
            'tristesse': '0',
            'colère': '1',
            'amour': '2',
            'surprise': '3',
            'peur': '4',
            'joie': '5',
        }
        self.model = self.__load_model(path)
        self.emotions_reverse = {k : v for v, k in self.emotions.items()}


    def __load_model(self, path):
        loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
        optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5,epsilon=1e-08)
        metric = tf.keras.metrics.SparseCategoricalAccuracy('accuracy')
        
        model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased',num_labels=len(self.emotions))
        model.compile(loss=loss,optimizer=optimizer, metrics=[metric])
        model.load_weights(path)

        print("==================================")
        print("\t  MODEL STARTED")
        print("==================================")

        return model


    def predict(self, tokens_list):
        preds_list = []
        for token in tokens_list:
            pred = self.model.predict([token["input_ids"], token["attention_mask"]], batch_size=32)
            preds_list.append(pred["logits"][0])
            
        return preds_list


    def normalize(self, results):
        if min(results) < 0:
            normalized_results = [(float(i)+abs(min(results)))/(max(results)+abs(min(results))) for i in results]
        else:
            normalized_results = [float(i)/sum(results) for i in results]
        
        normalized_results = [round(i, 2) for i in normalized_results]

        return normalized_results

    
    def best_result(self, preds_list):
        results_list = []
        for pred in preds_list:
            parsed = pred.argmax()
            emotion_pred = self.emotions_reverse[str(parsed)]
            results_list.append(emotion_pred)
        best_result = max(results_list, key = results_list.count)

        return best_result

    
    def detailed_results(self, preds_list, phrases):
        emotions_list = [x for x in self.emotions.keys()]
        
        detailed_results = {}
        for i in range(len(phrases)):
            detailed_results[phrases[i]] = {}
            for j in range(len(emotions_list)):
                preds_normalized = self.normalize(preds_list[i])
                detailed_results[phrases[i]][emotions_list[j]] = preds_normalized[j]

        return detailed_results
