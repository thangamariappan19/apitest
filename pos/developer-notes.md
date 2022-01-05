# Encrypt & Decrypt
>> npm install crypto-js --save
>> npm install @types/crypto-js –-save

# ngx-trim-directive
>> npm i -S ngx-trim-directive

# ngx easy table
>> npm install ngx-easy-table --save
>> npm install @angular/cdk --save

# multi select dropdown
>> npm install ng-multiselect-dropdown

# Excel
>> npm install xlsx

# Material Modal
>> ng add @angular/material

# QZ Tray 
>> npm install qz-tray sha ws
>> npm install --save rxjs-compat 
>> npm install jsrsasign jsrsasign-util
>> npm install rsvp

# PDF Viewer
>> npm install ng2-pdf-viewer --save

# bundle initial-es2015 exceeded maximum budget. Budget 5.00 MB was not met by 10.77 MB with a total of 15.77 MB.
>> angular.json >> change as below
"budgets": [
{
    "type": "initial",
    "maximumWarning": "100mb",
    "maximumError": "100mb"
},
{
    "type": "anyComponentStyle",
    "maximumWarning": "100mb",
    "maximumError": "100mb"
}

# allocation failure scavenge might not succeed angular
# ineffective mark-compacts near heap limit allocation failed - javascript heap out of memory angular 10
>> Run ng build as
>> 2GB >> node --max-old-space-size=2048 node_modules/@angular/cli/bin/ng build --prod
>> 4GB >> node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng build --prod
>> 6GB >> node --max-old-space-size=6144 node_modules/@angular/cli/bin/ng build --prod
>> 8GB >> node --max-old-space-size=8192 node_modules/@angular/cli/bin/ng build --prod

Run ng serve as
>> 2GB >> node --max-old-space-size=2048 node_modules/@angular/cli/bin/ng serve 
>> 4GB >> node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng serve 
>> 6GB >> node --max-old-space-size=6144 node_modules/@angular/cli/bin/ng serve 
>> 8GB >> node --max-old-space-size=8192 node_modules/@angular/cli/bin/ng serve 