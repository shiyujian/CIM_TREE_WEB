 for(var i = 0; i<=rst.length-1; i++){
                    Num1 = Num1 + rst[i].Num;
                    console.log(Num1);
                }
                console.log(Num1,"like");
            this.setState({
                data:rst,
                account:Num1,

            })
        })