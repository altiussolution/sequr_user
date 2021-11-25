enum appModels {
    LOGIN='employee/login',
    DETAILS='item/getItemById/',
    ADDTOCART='cart/add',
    USERPROFILE='employee/userProfile/',
   // CATEGORYLIST='category/getCategoryMachine/',
    //SUBCATEGORY='subCategory/getSubCategoryMachine/618e91b2e223f5393cc137dd/["1305167547307745"]',
    //ITEMLIST='getItemMachine/617021b82d9256f547185a83/6170223c2d9256f547185a93/["1305167547307745"]',
    CATEGORYLIST='category/getCategorylist',//category/getCategoryMachine/["1305167547307745"]',
    SUBCATEGORY='subCategory/get?category_id=',//'subCategory/getSubCategoryMachine/617021b82d9256f547185a83/["1305167547307745"]',
    ITEMLIST='cart/itemHistory',//'getItemMachine/617021b82d9256f547185a83/6170223c2d9256f547185a93/["1305167547307745"]',
    COLOMNIDS='machine/assignedColumns',
    KITTINGLIST='kitting/get',
    CITYLIST='region/city/',
    ADDKITCART='kitting/addKitToCart/',
    updateCart = 'cart/update',
    listCart = 'cart/myCart',
    LAN='region/language',
    CHANGEPWD='employee/changePassword/',
    RETURNCART='cart/return',
    RETURNKIT='kits/return',
    TAKENOW='machine',
    ITEM='item/get',
  

}
//614993f607f4ce431244b852
//6149b8ec74e1d5ef4317a9b1       1305167547316427 ["1305167547307745"]


export { appModels}