###
# testem.unittest.command
# Makes use of testem (https://github.com/airportyh/testem)
# to run all jasmine based unit-tests (both browser and node-based)
# 
# In order to work you must have installed:
# - Node
# - Testem (https://github.com/airportyh/testem)
# And if you're coding in node:
# - Jasmine-Node (https://github.com/mhevery/jasmine-node)
#
# Simply double-click the .command file...

cd "`dirname "$0"`"
cd ..
testem
