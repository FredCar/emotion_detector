import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer


class Tokenizer:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)

        print("============================")
        print("\t TOKENIZER LOADED")
        print("============================")


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
        self.model = self.load_model()
        self.emotions = {
            'tristesse': '0',
            'colère': '1',
            'amour': '2',
            'surprise': '3',
            'peur': '4',
            'joie': '5',
        }
        self.emotions_reverse = {k : v for v, k in self.emotions.items()}


    def load_model(self):
        model_save_path = "/src/model/bert_model.h5"
        num_labels = 6
        loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
        optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5,epsilon=1e-08)
        metric = tf.keras.metrics.SparseCategoricalAccuracy('accuracy')
        
        model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased',num_labels=num_labels)
        model.compile(loss=loss,optimizer=optimizer, metrics=[metric])
        model.load_weights(model_save_path)

        print("============================")
        print("\t MODEL STARTED")
        print("============================")

        return model


    def predict(self, token):
        pred = self.model.predict([token["input_ids"], token["attention_mask"]], batch_size=32)
        return pred

    
    def parse_preds(self, preds_list):
        results_list = []
        for pred in preds_list:
            parsed = pred["logits"].argmax(axis=1)
            emotion_pred = self.emotions_reverse[str(parsed[0])]
            results_list.append(emotion_pred)
        result = max(results_list, key = results_list.count)

        return result
