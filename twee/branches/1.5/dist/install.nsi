; Generated NSIS script file (generated by makensitemplate.phtml 0.21)
; by 68.48.123.220 on Dec 27 08 @ 17:56

; NOTE: this .NSI script is designed for NSIS v1.8+

Name "Tweebox 2.1"
OutFile "tweebox21.exe"

; Some default compiler settings (uncomment and change at will):
; SetCompress auto ; (can be off or force)
; SetDatablockOptimize on ; (can be off)
; CRCCheck on ; (can be off)
; AutoCloseWindow false ; (can be true for the window go away automatically at end)
; ShowInstDetails hide ; (can be show to have them shown, or nevershow to disable)
; SetDateSave off ; (can be on to have files restored to their orginal date)

InstallDir "$PROGRAMFILES\Tweebox"
InstallDirRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Tweebox" ""
;DirShow show ; (make this hide to not let the user change it)
DirText "Choose which folder to install Tweebox into:"

Section "" ; (default section)
SetOutPath "$INSTDIR"

; add files / whatever that need to be installed here.

File "*.pyd"
File "*.zip"
File "*.dll"
File "tweebox.exe"
File "w9xpopen.exe"
File /r "targets"

; add Start Menu entries

CreateDirectory "$SMPROGRAMS\Tweebox 2.1\"
CreateShortCut "$SMPROGRAMS\Tweebox 2.1\Tweebox.lnk" "$INSTDIR\tweebox.exe"
CreateShortCut "$SMPROGRAMS\Tweebox 2.1\Uninstall.lnk" "$INSTDIR\uninstalltweebox.exe"

; add uninstall entry in Add/Remove Programs

WriteRegStr HKEY_LOCAL_MACHINE "SOFTWARE\Tweebox" "" "$INSTDIR"
WriteRegStr HKEY_LOCAL_MACHINE "Software\Microsoft\Windows\CurrentVersion\Uninstall\Tweebox" "DisplayName" "Tweebox 2.1 (remove only)"
WriteRegStr HKEY_LOCAL_MACHINE "Software\Microsoft\Windows\CurrentVersion\Uninstall\Tweebox" "UninstallString" '"$INSTDIR\uninstalltweebox.exe"'

; write out uninstaller

WriteUninstaller "$INSTDIR\uninstalltweebox.exe"
SectionEnd ; end of default section


; begin uninstall settings/section

UninstallText "This will uninstall Tweebox 2.1 from your system."

Section Uninstall

; add delete commands to delete whatever files/registry keys/etc you installed here.

Delete "$INSTDIR\uninstalltweebox.exe"
DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Tweebox"
DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Tweebox"
RMDir /r "$SMPROGRAMS\Tweebox 2.1"
RMDir /r "$INSTDIR"
SectionEnd ; end of uninstall section

; eof
