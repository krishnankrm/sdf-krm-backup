
async function f2(a,b)
{   
    try {
        return(a+b)
    } catch (error) {
        return('error')
    }
}

function f1()
{
var a=10;
var b=100;
boxlistpromise1=f2(a,b)
console.log(boxlistpromise1)
}

f1()