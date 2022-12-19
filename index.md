---
title: "SPICE+: Evaluation of Automatic Audio Captioning Systems with Pre-trained Language Models"
layout: project
---



## Examples

This companion page compares the original implementation of SPICE to the proposed SPICE+. To do so, examples below illustrate differences between the two metrics on 20 examples from the [Clotho](https://zenodo.org/record/4783391) public evaluation set. Each audio input is processed by the baseline model of the [DCASE2022 challenge captioning task](https://dcase.community/challenge2022/task-automatic-audio-captioning). The produced caption is evaluated against a set of five human-annotated references.

The SPICE+ evaluation process is similar to that of SPICE. First, captions are annotated on universal dependencies with a pre-trained language model (here [UDify](https://github.com/hyperparticle/udify)). A set of linguistic rules is then matched to the annotation to obtain semantic graphs composed of nodes, attributes and relations. Pairs of tuples from the reference and candidate graphs are compared by the cosine similarity of their sentence embeddings, computed with a Sentence-BERT model. The agregation of these similarities along candidate and reference tuples yields a measure of precision and recall, respectively.


{% include spice-examples.html %}






