/**
 * thunkify函数THUNK
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-12-12 15:51:29
 * @version $Id$
 */

 function thunkify(fn){
   // assert('function' == typeof fn, 'function required');

   return function(){
     var args = new Array(arguments.length);
     var ctx = this;

     for(var i = 0; i < args.length; ++i) {
       args[i] = arguments[i];
     }

     return function(done){
       var called;

       args.push(function(){
         if (called) return;
         called = true;
         done.apply(null, arguments);
       });

       try {
         fn.apply(ctx, args);
       } catch (err) {
         done(err);
       }
     }
   }
 };