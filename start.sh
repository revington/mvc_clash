#!/bin/bash

export DB=http://localhost:5984/mvclash
export PORT=3000

curl -X PUT "$DB"
curl -H "Content-Type: application/json" -d '
{
    "_id": "_design/products",
    "language": "javascript",
    "views": {
        "byId": {
            "map": "function(doc) {\n  if(doc.type !== \"product\") {return;}\n  emit(doc._id);\n}"
        },
        "byTag": {
            "map": "function(doc) {\n   if(doc.type !== \"product\") {return;}\n   for(var tag in doc.tags){\n     emit(doc.tags[tag],1);\n   }\n}",
            "reduce": "_count"
        }
    }
} ' "$DB"
nodemon server.js
