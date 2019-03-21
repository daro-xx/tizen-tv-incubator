set tvip=192.168.0.106
set appName=Incubator
set packageId=XN64CP9VcE
set appId=%packageId%.%appName%
set buildType=%1%
cls
call grunt --force
call sdb connect %tvip%
call tizen build-web -- dist/
call tizen package -t wgt -s srpol -- dist/.buildResult
call xcopy /Y /I "dist\.buildResult\Incubator.wgt" "dist"
call tizen clean -- dist
call tizen install -n %appName%.wgt -t UE49MU9000 -- "dist"

if "%buildType%"=="vd" (
    call sdb shell 0 debug %appId% 300
) else (
    call tizen run -p %appId% -t UE49MU9000
)