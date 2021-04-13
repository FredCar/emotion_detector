import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer
from googletrans import Translator


class Preprocess:
    def __init__(self):
        self.translator = Translator(raise_exception=False)
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)

        print("==================================")
        print("\t TOKENIZER LOADED")
        print("==================================")


    def translate(self, sent):
        translated = self.translator.translate(sent, dest="en").text
        return translated


    def tokenize(self, sents):
        tokens_list = []
        for sent in sents:
            tokenized = self.tokenizer.encode_plus(
                sent,
                add_special_tokens = True,
                max_length = 30,
                pad_to_max_length = True, 
                return_attention_mask = True
            )
            tokens_list.append(tokenized)
        return tokens_list



class Model:
    def __init__(self):
        self.model = self.__load_model()
        self.emotions = {
            'tristesse': '0',
            'colère': '1',
            'amour': '2',
            'surprise': '3',
            'peur': '4',
            'joie': '5',
        }
        self.emotions_reverse = {k : v for v, k in self.emotions.items()}


    def __load_model(self):
        model_save_path = "/src/model/bert_model.h5"
        num_labels = 6
        loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
        optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5,epsilon=1e-08)
        metric = tf.keras.metrics.SparseCategoricalAccuracy('accuracy')
        
        model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased',num_labels=num_labels)
        model.compile(loss=loss,optimizer=optimizer, metrics=[metric])
        model.load_weights(model_save_path)

        print("==================================")
        print("\t  MODEL STARTED")
        print("==================================")

        return model


    def predict(self, tokens_list):
        preds_list = []
        for token in tokens_list:
            pred = self.model.predict([token["input_ids"], token["attention_mask"]], batch_size=32)
            # TODO Comprendre ce qu'est la 2eme liste retournée dans "logits"
            preds_list.append(pred["logits"][0])
            
        return preds_list

    
    def best_result(self, preds_list):
        results_list = []
        for pred in preds_list:
            parsed = pred.argmax()
            emotion_pred = self.emotions_reverse[str(parsed)]
            results_list.append(emotion_pred)
        best_result = max(results_list, key = results_list.count)

        return best_result

    
    def detailed_results(self, preds_list):
        detailed_results = {}
        for emotion in self.emotions.keys():
            detailed_results[emotion] = 0

        for pred in preds_list:
            detailed_results["tristesse"] += pred[0]
            detailed_results["colère"] += pred[1]
            detailed_results["amour"] += pred[2]
            detailed_results["surprise"] += pred[3]
            detailed_results["peur"] += pred[4]
            detailed_results["joie"] += pred[5]

        for key, value in detailed_results.items():
            detailed_results[key] = round(value, 2)

        return detailed_results
