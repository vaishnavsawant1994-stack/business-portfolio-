const MAX_BODY=12000;
function json(res,status,payload){res.status(status).setHeader("Content-Type","application/json; charset=utf-8").setHeader("Cache-Control","no-store").send(JSON.stringify(payload))}
function clean(s,max){return typeof s==="string"?s.trim().slice(0,max):""}
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"Method not allowed."});
 const len=Number(req.headers["content-length"]||0);if(len>MAX_BODY)return json(res,413,{error:"Message too large."});
 const body=req.body&&typeof req.body==="object"?req.body:{};
 if(body.website)return json(res,200,{message:"Processed."});
 const name=clean(body.name,120),email=clean(body.email,254),company=clean(body.company,160),budget=clean(body.budget,60),project=clean(body.project,5000);
 if(!name||!project||project.length<10||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json(res,400,{error:"Provide a valid name, email, and a project description of at least 10 characters."});
 if(!process.env.RESEND_API_KEY||!process.env.CONTACT_TO_EMAIL||!process.env.CONTACT_FROM_EMAIL)return json(res,503,{error:"Contact delivery is not configured. Please contact the website owner through another channel."});
 const lines=[["Name",name],["Email",email],["Company",company],["Budget",budget],["Project",project]].map(([k,v])=>k+": "+v.replace(/[\r\n]+/g," ")).join("\n");
 try{const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[process.env.CONTACT_TO_EMAIL],reply_to:email,subject:"New portfolio enquiry",text:lines})});
 if(!result.ok){return json(res,502,{error:"Email delivery failed. Please try again later."})}
 return json(res,200,{message:"Enquiry sent."});
 }catch{return json(res,502,{error:"Unable to reach the mail delivery service. Please retry."})}
}
