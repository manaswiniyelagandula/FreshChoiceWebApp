const e = require("express");
const express = require("express");
const math=
{
	add:function(a,b)
	{
		return a+b;
	}
}
const app = express();
const port = 3000;

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");
initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(req,res)=>{
	res.send("Hello! Welcome to Fresh Choice BVRITH");
});

app.get("/login",(req,res)=>{
	res.render("login");
});
app.get("/loginsubmit",(req,res)=>{
	const email=req.query.email;
	const pwd=req.query.pwd;
	console.log(req);
	db.collection("Customers")
	.where("Email","==",email)
	.where("Password","==",pwd)
	.get()
	.then((docs) => {
		if(docs.size > 0){
			res.render("home");
		}
		else{
			res.render("signup");
		}
	});
});

app.get("/signup",(req,res)=>{
	res.render("signup");
});
app.get("/signupsubmit",(req,res)=>{
	const email=req.query.email;
	const pwd=req.query.pwd;
	db.collection("Customers").add({
		Email : email,
		Password: pwd,
	}).then(()=>{
		res.render("login");
	});
});

app.get("/home",(req,res)=>{
	res.render("home");
});

const arr=[];
const costs=[];
var amount=0;
app.get("/addedToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.Cost;
	costs.push(c);
	c=eval(c.slice(0,c.length-2));
	console.log(c);
	amount=math.add(amount,c);
	arr.push(val);
	res.render("home");
});

app.get("/cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("Cart").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});

app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
});
