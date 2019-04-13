## Turing react web client

Some notes.

You write code in src directory. There are following directories:

+ components
    Here you will implement all react components
+ models
    Here go all classes interfaces or any other type that
    describe data in the application or data coming from server
    or similar. This should be simple classes with usually providing 
    a simple way to construct and modify data if that makes sense, also 
    copying data. It is not uncommon to proved config interface for your
    data that has all fields optional or something that can be used to
    construct models but not necessarily have the same data as the model
    Also typescript guards are a good idea to implement here
+ services
    This is where you define all your shared data for the application
    it may use server for fetching the data, but it can also be completely
    local. You define interface for your service and then implement it
    then you register it with ServiceLocator  in App.tsx file.
