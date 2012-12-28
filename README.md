app5upport
==========

HTML5 App Support, useful JS scripts to smoothen app creation.

** Initial setup for using JSTestDriver in combination with Jasmine

    git submodule add git@github.com:pivotal/jasmine.git ./test/jasmine
    git submodule add git@github.com:ibolmo/jasmine-jstd-adapter.git ./test/jasmine-jstd-adapter
    cd ./test/jasmine
    git reset --hard fd914337925a1e2729e2583a1023b2293d54ca55
    
Although now that that's been done, all you should do is

    git submodule init
    git submodule update
