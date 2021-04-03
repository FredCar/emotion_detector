
import tensorflow as tf
from transformers import TFBertForSequenceClassification
from transformers import BertTokenizer


def load_model():
    model_save_path = ""
    num_labels = 2
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5,epsilon=1e-08)
    metric = tf.keras.metrics.SparseCategoricalAccuracy('accuracy')
    
    model = TFBertForSequenceClassification.from_pretrained('bert-base-uncased',num_labels=num_labels)
    model.compile(loss=loss,optimizer=optimizer, metrics=[metric])
    model.load_weights(model_save_path)

    return model