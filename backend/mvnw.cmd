@ECHO OFF
SETLOCAL

SET WRAPPER_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties
FOR /F "tokens=1,* delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
  IF "%%A"=="distributionUrl" SET DISTRIBUTION_URL=%%B
)

FOR %%F IN ("%DISTRIBUTION_URL%") DO SET ARCHIVE_NAME=%%~nxF
SET INSTALL_ROOT=%~dp0.mvn\wrapper\dist
SET ARCHIVE_PATH=%INSTALL_ROOT%\%ARCHIVE_NAME%
SET MAVEN_DIR=%INSTALL_ROOT%\apache-maven-3.9.9

IF EXIST "%MAVEN_DIR%\bin\mvn.cmd" (
  CALL "%MAVEN_DIR%\bin\mvn.cmd" %*
  EXIT /B %ERRORLEVEL%
)

WHERE mvn >NUL 2>&1
IF %ERRORLEVEL% EQU 0 (
  CALL mvn %*
  EXIT /B %ERRORLEVEL%
)

ECHO Maven wrapper bootstrap on Windows requires local Maven or a preinstalled Maven distribution in %MAVEN_DIR%.
EXIT /B 1
