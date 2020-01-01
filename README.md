### 设计规范

1. 所有设计的逻辑和类要成为可配置的，可以根据需求替换掉逻辑(尤其是替换掉C++实现的的逻辑)。
2. 写真正的业务代码之前**第一步**要设计接口作为中间层，设计接口之后不要实现，**必须先提交接口**(可以没有任何逻辑，只是打印log都可以)，可以供其他人使用，避免依赖工作间的等待。
3. 保持接口的稳定和可扩展，接口不能随意变动，命名应该抽象，接收参数应该齐全（所有依赖外部的参数都要传递），保持接口自身的无状态。
4. 所有写的业务依赖的工具函数要抽出作为通用的工具，比如之前写的下载Pak列表的功能，其中包含下载任意文件的功能，要抽出作为通用的代码，类似的可以抽象出来的都要单独写成可以随意调用的函数，不能够依赖调用顺序。
5. 待补充。

### 代码规范

基础要求是需要执行UE的代码标准：[Coding Standard](https://docs.unrealengine.com/en-US/Programming/Development/CodingStandard/index.html)

额外的扩展要求：

1. 每一个USTRUCT、UObject（可除去U）、函数库也必须单独位于一个同名的源文件，且函数库的命名为以`Flib`开头；
2. 所有的头文件中所包含的其他头文件必须区分引擎和项目，在包含头文件里使用`// Project Header`和`// Engine Header`注释。

2. 项目里所有的类，不管具体是在蓝图里实现还是C++实现，必须要有C++的基类和C++的接口，注意基类和接口只写通用的东西，不要写具体的业务流程。

3. 所有的非内部成员（不暴露给外部使用的成员）都写成UFUNCTION，属性也同理，加了UFUNCTION和UPROPERTY可以被反射使用。

4. C++写的类的数据成员的初始化顺序必须要与声明顺序一致。

5. 在有可能会执行失败的函数中必须要提供返回值，在Get函数中同样需要（错误码或者bool都可以），并且不可以直接在执行结尾`return true;`最终执行的结果要根据前面可能会执行失败的逻辑是否成功；

6. 禁止所有的static成员的在全局作用域初始化操作（尤其是获取引擎数据的初始化），只允许字面值类型的static初始化，如`static FString Name = TEXT("helloworld")`等；

8. 对于在局部作用域创建的**资源**（裸内存或者文件访问）要使用`ON_SCOPE_EXIT`来确保释放逻辑；

9. Lambda引用捕获的对象不可做为异步逻辑操作的对象，如在一个函数内创建了lambda对象引用捕获了局部变量，将其传递给异步逻辑，这种操作是禁止的。

10. UE中默认中禁止`dynamic_cast`，在UEC++的范畴内不要使用标准C++的转换，可以使用`Cast<>`；

11. 继承自UObject的对象统一使用`GENERATED_UCLASS_BODY`，并需要创建出`XXXXX:XXXXX(const FObjectInitializer& InObjectInitializer)`的构造函数；

12. 函数内如果有可能具有某种竞争逻辑，则需要使用`FScopeLock ScopeLock(&CriticalSection);`为当前作用域加锁，防止资源竞争；

13. 尽量使用防御式编程的Impl机制

14. 项目中完全禁止使用异常，`bForceEnableExceptions`不可以被设置为true;

15. 用C++创建的结构成员必须要提供`==`的操作符

16. 用C++创建的结构成员如果要自定义构造函数，则需要提供默认构造函数、拷贝构造函数、移动构造函数、赋值操作符的实现，偷懒可以使用`A()=default;`，如果使用default就需要确保类内没有引用某种资源；

17. 用C++创建的供外部使用的结构成员必须使用`UPROPERTY`并且需要提供`BlueprintReadWrite`属性；

18. 所有暴露给其他模块使用的类必须有导出符号`MODULE_NAME_API`

19. 所有的插件和单独的模块在`build.cs`中必须写`OptimizeCode=CodeOptimization.InShippingBuildsOnly`，方便调试。

20. 所有Editor模块的插件加载顺序必须先于`Default`，可以使用`PreDefault`或者`PostEngineInit`；

21. 在代码中使用的宏统一需要由`build.cs`中来创建，使用`PublicDefinitions`来添加。

22. 所有依赖的第三方代码必须要支持最少`Windows/MacOS/Android/IOS`四个平台。

23. 代码文件的编码格式统一为UTF-8

### 命名规则
UE的架构内的命名同样依赖UE的代码标准[Coding Standard](https://docs.unrealengine.com/en-US/Programming/Development/CodingStandard/index.html)

1. 变量名要能够标识出类型，比如b开头是bool,i默认是int32，特殊位长的需要特殊命名，无符号类型要加u；
2. 函数库统一使用Flib开头；
3. Delegate命名时要能够标识出其类型，可以使用缩写，Dy代表动态代理，Multi代表多播代理，Dlg代表是代理；
4. 游戏框架内的Subsystem类必须要以`Subsys`开头，并且能够知道这个类是做什么的，比如`SubsysGameUpdater`和其子类`SubsysHTTPGameUpdater`；
5. 函数的命名要能够根据名字知道它要做什么事情、所有获取的方法统一使用Get，进行检测的可以使用TryGet命名；
6. 函数传入的参数必须以In开头，返回的参数必须以Out开头（引用）；
7. 函数有可能会执行失败的要返回bool或者错误码（返回值必须要有意义，不能逻辑中什么都不判断直接在函数末尾写`return true`）
8. 蓝图的类统一使用`BP_`开头
9. UI的类统一使用`UMG_`开头；
