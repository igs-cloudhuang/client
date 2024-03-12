SET "PATH=C:\Program Files\CodeAndWeb\TexturePacker\bin;%PATH%"


@SET LANG_LIST=(bn-IN en-US es-AR hi-IN id-ID ja-JP ko-KR ms-MY my-MM pt-BR ta-IN th-TH vi-VN zh-CN zh-TW tr-TR ru-RU it-IT ro-RO)


for %%i in %LANG_LIST% do (
    start cmd /c "main.exe %%i -c&&TexturePacker %%i.tps&&main.exe %%i -d"
)

@REM pause