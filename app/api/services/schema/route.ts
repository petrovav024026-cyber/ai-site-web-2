export const runtime = "nodejs";

const stepSchema = {
  "$id":"https://b2bc.ai/schemas/step.schema.json",
  "$schema":"http://json-schema.org/draft-07/schema#",
  "title":"Service Step",
  "type":"object",
  "required":["key","title"],
  "properties":{
    "key":{"type":"string"},
    "title":{"type":"string"},
    "kind":{"type":"string","enum":["text","form","review"]},
    "html":{"type":"string"},
    "md":{"type":"string"}
  },
  "additionalProperties": true
};

const serviceSchema = {
  "$id":"https://b2bc.ai/schemas/service.schema.json",
  "$schema":"http://json-schema.org/draft-07/schema#",
  "title":"Service",
  "type":"object",
  "required":["id","slug","title","route","active","order"],
  "properties":{
    "id":{"type":"string"},
    "slug":{"type":"string"},
    "title":{"type":"string"},
    "short":{"type":"string"},
    "route":{"type":"string"},
    "active":{"type":"boolean"},
    "order":{"type":"number"},
    "steps":{"type":"array","items": stepSchema }
  },
  "additionalProperties": true
};

export async function GET(){
  return Response.json({ stepSchema, serviceSchema }, { headers: { "Cache-Control":"no-store" } });
}
