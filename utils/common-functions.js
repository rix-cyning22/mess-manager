exports.getDayDow = () => {
    const today = new Date();
    const dowNum = today.getDay();
    days = ['Sunday', 'Monday', 'Tuesday', 
            'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dd = String(today.getDate()).padStart(2, '0'); 
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    const currentDate = dd + '/' + mm + '/' + yyyy;

    return [currentDate, days[dowNum]];
}

exports.mealPrice = (meal) => {
    var mealTotal = 0;
    for (const mealItem of meal)  
        mealTotal += mealItem.tot;
    return mealTotal;
}

exports.handleFlash = (req) => {
    const message = req.flash("error");
    if (message.length > 0) 
        error = message[0];
    else 
        error = null; 
    return error;
}