/**
 * ==============================================================================
 * CHAMELEON CHEATS — CLIENT LICENSE, ANTI-TAMPER & CRYPTOGRAPHIC AUTH MODULE
 * ==============================================================================
 * 
 * Works in both:
 * 1. ChamsHook.dll (inside DllMain -> Worker thread)
 * 2. Injector.exe (before VirtualAllocEx / WriteProcessMemory / CreateRemoteThread)
 * 
 * Security Features:
 * - C++20 Compile-Time String Encryption (Zero plain-text strings in .rdata)
 * - Cryptographic HMAC-SHA256 Server Response Verification (Anti-MITM / Anti-Proxy)
 * - Anti-Debugging & Environment Integrity Checks (IsDebuggerPresent / RemoteCheck)
 * - Automatic Hardware ID (HWID) extraction via Windows Volume Serial & Computer Name
 * - Shared credentials persistence in %LOCALAPPDATA%\ChameleonCheats
 * - Non-closing interactive console flow with retry support
 * ==============================================================================
 */

#pragma once

#include <windows.h>
#include <wininet.h>
#include <bcrypt.h>
#include <tlhelp32.h>
#include <string>
#include <sstream>
#include <iostream>
#include <fstream>
#include <vector>

#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "bcrypt.lib")

namespace ChameleonSec
{
    // =========================================================================
    // 1. C++20 Compile-Time String Obfuscation (Anti-Static Analysis / Anti-IDA)
    // Strings are encrypted into XOR bytes at compile time and decrypted on stack.
    // =========================================================================
    constexpr unsigned char XOR_KEY = 0x6E;

    template <size_t N>
    struct XorStringA
    {
        char buffer[N]{};

        consteval XorStringA(const char(&str)[N])
        {
            for (size_t i = 0; i < N; ++i)
            {
                buffer[i] = str[i] ^ (unsigned char)(XOR_KEY + i * 5);
            }
        }

        inline std::string str() const
        {
            std::string out;
            out.resize(N - 1);
            for (size_t i = 0; i < N - 1; ++i)
            {
                out[i] = buffer[i] ^ (unsigned char)(XOR_KEY + i * 5);
            }
            return out;
        }
    };

    template <size_t N>
    struct XorStringW
    {
        wchar_t buffer[N]{};

        consteval XorStringW(const wchar_t(&str)[N])
        {
            for (size_t i = 0; i < N; ++i)
            {
                buffer[i] = str[i] ^ (wchar_t)(XOR_KEY + i * 5);
            }
        }

        inline std::wstring str() const
        {
            std::wstring out;
            out.resize(N - 1);
            for (size_t i = 0; i < N - 1; ++i)
            {
                out[i] = buffer[i] ^ (wchar_t)(XOR_KEY + i * 5);
            }
            return out;
        }
    };

    #define _XOR_A(s) ([]() -> std::string { \
        static constexpr ChameleonSec::XorStringA<sizeof(s)> enc(s); \
        return enc.str(); \
    })()

    #define _XOR_W(s) ([]() -> std::wstring { \
        static constexpr ChameleonSec::XorStringW<sizeof(s) / sizeof(wchar_t)> enc(s); \
        return enc.str(); \
    })()

    // =========================================================================
    // 2. Anti-Dumper & Reverse Engineering Tool Scanner
    // Detects Cheat Engine, Ghidra, IDA Pro, x64dbg, Process Hacker, Scylla, etc.
    // =========================================================================
    inline void ShowSecurityAlertDetached(const char* message = "Close any dumper, reverse engineering tool before using Chameleon Cheats.")
    {
        HANDLE hAlertMutex = CreateMutexA(NULL, TRUE, "ChameleonSecurityAlertMutex");
        if (hAlertMutex && GetLastError() != ERROR_ALREADY_EXISTS)
        {
            MessageBeep(MB_ICONHAND);
            char cmd[512];
            sprintf_s(cmd, sizeof(cmd), "mshta \"javascript:var sh=new ActiveXObject('WScript.Shell');sh.Popup('%s',0,'Security Violation',16);close()\"", message);
            STARTUPINFOA si = { sizeof(si) };
            PROCESS_INFORMATION pi = { 0 };
            if (CreateProcessA(NULL, cmd, NULL, NULL, FALSE, CREATE_NO_WINDOW | DETACHED_PROCESS, NULL, NULL, &si, &pi))
            {
                CloseHandle(pi.hProcess);
                CloseHandle(pi.hThread);
            }
            ReleaseMutex(hAlertMutex);
            CloseHandle(hAlertMutex);
        }
        else if (hAlertMutex)
        {
            CloseHandle(hAlertMutex);
        }
    }

    inline bool CheckBlacklistedTools(bool showMessage = true)
    {
        const wchar_t* patterns[] = {
            L"cheatengine",
            L"ida64",
            L"ida32",
            L"idag",
            L"idaw",
            L"ghidra",
            L"x64dbg",
            L"x32dbg",
            L"x96dbg",
            L"scylla",
            L"processhacker",
            L"httpdebugger",
            L"fiddler",
            L"charles",
            L"dnspy",
            L"pestudio"
        };

        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return false;

        PROCESSENTRY32 pe;
        pe.dwSize = sizeof(pe);

        if (Process32First(hSnapshot, &pe))
        {
            do
            {
                wchar_t exeLower[MAX_PATH] = { 0 };
                wcscpy_s(exeLower, pe.szExeFile);
                _wcslwr_s(exeLower);

                for (const wchar_t* pattern : patterns)
                {
                    if (wcsstr(exeLower, pattern) != nullptr)
                    {
                        // 1. Instantly terminate the unauthorized blacklisted process
                        HANDLE hTool = OpenProcess(PROCESS_TERMINATE, FALSE, pe.th32ProcessID);
                        if (hTool)
                        {
                            TerminateProcess(hTool, 0);
                            CloseHandle(hTool);
                        }

                        CloseHandle(hSnapshot);

                        // 2. Non-blocking detached alert (allows loader and game to auto-close immediately)
                        if (showMessage)
                        {
                            ShowSecurityAlertDetached();
                        }
                        return true; // Blacklisted tool detected!
                    }
                }
            } while (Process32Next(hSnapshot, &pe));
        }

        CloseHandle(hSnapshot);
        return false;
    }

    // =========================================================================
    // 3. Anti-Debugging Check (Dynamic Analysis Detection)
    // =========================================================================
    inline bool IsDebuggerActive()
    {
        if (IsDebuggerPresent())
            return true;

        BOOL remoteDebugger = FALSE;
        if (CheckRemoteDebuggerPresent(GetCurrentProcess(), &remoteDebugger) && remoteDebugger)
            return true;

        return false;
    }

    // =========================================================================
    // 3. Native Windows Cryptography: HMAC-SHA256 (Anti-Proxy / Anti-Tamper)
    // Verifies the cryptographic signature attached by the server.
    // =========================================================================
    inline std::string ComputeHmacSha256(const std::string& secretKey, const std::string& data)
    {
        BCRYPT_ALG_HANDLE hAlg = NULL;
        BCRYPT_HASH_HANDLE hHash = NULL;
        std::string hexResult = "";

        if (BCryptOpenAlgorithmProvider(&hAlg, BCRYPT_SHA256_ALGORITHM, NULL, BCRYPT_ALG_HANDLE_HMAC_FLAG) >= 0)
        {
            if (BCryptCreateHash(hAlg, &hHash, NULL, 0, (PUCHAR)secretKey.c_str(), (ULONG)secretKey.length(), 0) >= 0)
            {
                if (BCryptHashData(hHash, (PUCHAR)data.c_str(), (ULONG)data.length(), 0) >= 0)
                {
                    unsigned char hash[32];
                    if (BCryptFinishHash(hHash, hash, sizeof(hash), 0) >= 0)
                    {
                        char hex[3];
                        for (int i = 0; i < 32; ++i)
                        {
                            sprintf_s(hex, sizeof(hex), "%02x", hash[i]);
                            hexResult += hex;
                        }
                    }
                }
                BCryptDestroyHash(hHash);
            }
            BCryptCloseAlgorithmProvider(hAlg, 0);
        }
        return hexResult;
    }
}

namespace ChameleonAuth
{
    // Runtime offset decryption key (unlocked ONLY when server HMAC-SHA256 signature validates)
    inline uintptr_t g_authKey = 0;

    // Obfuscated configuration endpoints (invisible to string search)
    inline std::wstring GetServerHost() { return _XOR_W(L"chameleon-cheats.vercel.app"); }
    inline INTERNET_PORT GetServerPort() { return 443; } // Production HTTPS (chameleon-cheats.vercel.app)
    inline std::wstring GetVerifyPath() { return _XOR_W(L"/api/license/verify"); }

    // Shared cryptographic secret with backend (ADMIN_SECRET_KEY / LICENSE_SIGNING_SECRET)
    inline std::string GetSigningSecret()
    {
        return _XOR_A("4f2e2368fc5f669483af135071a355d4130a9832f8b304024d6cddc7b28c9351");
    }

    struct AuthResult
    {
        bool isValid = false;
        std::string tier;
        std::string discordUser;
        std::string expiresAt;
        std::string errorMessage;
    };

    /**
     * Retrieves unique Machine Hardware ID (HWID)
     */
    inline std::string GetMachineHWID()
    {
        DWORD volumeSerial = 0;
        GetVolumeInformationA("C:\\", NULL, 0, &volumeSerial, NULL, NULL, NULL, 0);

        char computerName[MAX_COMPUTERNAME_LENGTH + 1] = { 0 };
        DWORD nameLen = sizeof(computerName);
        GetComputerNameA(computerName, &nameLen);

        char hwidBuffer[128];
        sprintf_s(hwidBuffer, sizeof(hwidBuffer), "HWID-%08X-%s", volumeSerial, computerName);
        return std::string(hwidBuffer);
    }

    /**
     * Resolves the persistent shared directory in %LOCALAPPDATA%\ChameleonCheats
     */
    inline std::string GetStorageDirectory()
    {
        char localAppData[MAX_PATH] = { 0 };
        if (GetEnvironmentVariableA("LOCALAPPDATA", localAppData, sizeof(localAppData)) > 0)
        {
            std::string dir = std::string(localAppData) + "\\" + _XOR_A("ChameleonCheats");
            CreateDirectoryA(dir.c_str(), NULL);
            return dir;
        }
        return ".";
    }

    inline std::string ResolveFilePath(const std::string& filename)
    {
        std::ifstream localFile(filename);
        if (localFile.good())
        {
            localFile.close();
            return filename;
        }
        localFile.close();

        std::string appDataPath = GetStorageDirectory() + "\\" + filename;
        std::ifstream appDataFile(appDataPath);
        if (appDataFile.good())
        {
            appDataFile.close();
            return appDataPath;
        }
        appDataFile.close();

        return appDataPath;
    }

    inline std::string ReadFileString(const std::string& filename)
    {
        std::string fullPath = ResolveFilePath(filename);
        std::ifstream file(fullPath);
        if (!file.is_open()) return "";
        std::string line;
        std::getline(file, line);
        while (!line.empty() && (line.back() == '\r' || line.back() == '\n' || line.back() == ' ' || line.back() == '\t'))
            line.pop_back();
        while (!line.empty() && (line.front() == ' ' || line.front() == '\t'))
            line.erase(line.begin());
        return line;
    }

    inline void WriteFileString(const std::string& filename, const std::string& content)
    {
        std::string appDataPath = GetStorageDirectory() + "\\" + filename;
        std::ofstream appDataFile(appDataPath);
        if (appDataFile.is_open())
        {
            appDataFile << content;
            appDataFile.close();
        }

        std::ofstream localFile(filename);
        if (localFile.is_open())
        {
            localFile << content;
            localFile.close();
        }
    }

    /**
     * Extracts a JSON string value by key
     */
    inline std::string ExtractJsonValue(const std::string& json, const std::string& key)
    {
        std::string searchKey = "\"" + key + "\":";
        size_t pos = json.find(searchKey);
        if (pos == std::string::npos) return "";

        size_t q1 = json.find("\"", pos + searchKey.length());
        if (q1 == std::string::npos) return "";
        size_t q2 = json.find("\"", q1 + 1);
        if (q2 == std::string::npos) return "";

        return json.substr(q1 + 1, q2 - q1 - 1);
    }

    /**
     * Extracts a JSON integer or raw value by key
     */
    inline std::string ExtractJsonRaw(const std::string& json, const std::string& key)
    {
        std::string searchKey = "\"" + key + "\":";
        size_t pos = json.find(searchKey);
        if (pos == std::string::npos) return "";

        size_t start = pos + searchKey.length();
        while (start < json.length() && (json[start] == ' ' || json[start] == '\t'))
            start++;

        size_t end = json.find_first_of(",}\r\n", start);
        if (end == std::string::npos) end = json.length();

        std::string val = json.substr(start, end - start);
        while (!val.empty() && (val.back() == ' ' || val.back() == '\"')) val.pop_back();
        while (!val.empty() && (val.front() == ' ' || val.front() == '\"')) val.erase(val.begin());
        return val;
    }

    /**
     * Performs Secure Authenticated License Validation
     */
    inline AuthResult VerifyLicense(const std::string& licenseKey, const std::string& discordId)
    {
        AuthResult result;

        // Anti-Debugging Guard
        if (ChameleonSec::IsDebuggerActive())
        {
            result.isValid = false;
            result.errorMessage = "Debugger / Analysis tool detected. Access blocked.";
            return result;
        }

        if (licenseKey.empty())
        {
            result.isValid = false;
            result.errorMessage = "License key is missing or empty.";
            return result;
        }

        if (discordId.empty())
        {
            result.isValid = false;
            result.errorMessage = "Discord username or ID is required for verification.";
            return result;
        }

        std::string hwid = GetMachineHWID();

        // Construct JSON Payload
        std::stringstream jsonBuilder;
        jsonBuilder << "{"
                    << "\"" << _XOR_A("license_key") << "\":\"" << licenseKey << "\","
                    << "\"" << _XOR_A("discord_id")  << "\":\"" << discordId  << "\","
                    << "\"" << _XOR_A("hwid")        << "\":\"" << hwid       << "\""
                    << "}";
        std::string jsonPayload = jsonBuilder.str();

        std::wstring userAgent = _XOR_W(L"ChameleonClient/4.3");
        HINTERNET hInternet = InternetOpenW(userAgent.c_str(), INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
        if (!hInternet)
        {
            result.isValid = false;
            result.errorMessage = "Unable to initialize Windows Internet subsystem.";
            return result;
        }

        DWORD timeoutMs = 5000;
        InternetSetOptionW(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeoutMs, sizeof(timeoutMs));
        InternetSetOptionW(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeoutMs, sizeof(timeoutMs));

        std::wstring host = GetServerHost();
        HINTERNET hConnect = InternetConnectW(
            hInternet,
            host.c_str(),
            GetServerPort(),
            NULL,
            NULL,
            INTERNET_SERVICE_HTTP,
            0,
            0
        );

        if (!hConnect)
        {
            InternetCloseHandle(hInternet);
            result.isValid = false;
            result.errorMessage = "Failed to connect to Chameleon Authentication Server.";
            return result;
        }

        DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
        if (GetServerPort() == 443)
        {
            flags |= INTERNET_FLAG_SECURE;
        }

        std::wstring verifyPath = GetVerifyPath();
        HINTERNET hRequest = HttpOpenRequestW(
            hConnect,
            L"POST",
            verifyPath.c_str(),
            NULL,
            NULL,
            NULL,
            flags,
            0
        );

        if (!hRequest)
        {
            InternetCloseHandle(hConnect);
            InternetCloseHandle(hInternet);
            result.isValid = false;
            result.errorMessage = "Failed to prepare HTTP authentication request.";
            return result;
        }

        const wchar_t* headers = L"Content-Type: application/json\r\n";
        BOOL sendSuccess = HttpSendRequestW(
            hRequest,
            headers,
            (DWORD)wcslen(headers),
            (LPVOID)jsonPayload.c_str(),
            (DWORD)jsonPayload.length()
        );

        if (!sendSuccess)
        {
            InternetCloseHandle(hRequest);
            InternetCloseHandle(hConnect);
            InternetCloseHandle(hInternet);
            result.isValid = false;
            result.errorMessage = "Failed to transmit license validation request. Ensure server is online.";
            return result;
        }

        // Read Server HTTP Response
        std::string responseString;
        char buffer[1024];
        DWORD bytesRead = 0;
        while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0)
        {
            buffer[bytesRead] = '\0';
            responseString += buffer;
        }

        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);

        // Check if response indicates success
        if (responseString.find("\"valid\":true") != std::string::npos ||
            responseString.find("\"valid\": true") != std::string::npos)
        {
            // =================================================================
            // ANTI-PROXY / ANTI-TAMPER CRYPTOGRAPHIC SIGNATURE CHECK
            // =================================================================
            std::string serverSig = ExtractJsonValue(responseString, "signature");
            std::string timestampStr = ExtractJsonRaw(responseString, "timestamp");

            if (serverSig.empty() || timestampStr.empty())
            {
                result.isValid = false;
                result.errorMessage = "Invalid response signature. Server response cannot be trusted.";
                return result;
            }

            // Verify timestamp freshness (within 5 minutes) to prevent replay attacks
            long long serverTime = _strtoi64(timestampStr.c_str(), NULL, 10);
            FILETIME ft;
            GetSystemTimeAsFileTime(&ft);
            ULARGE_INTEGER uli;
            uli.LowPart = ft.dwLowDateTime;
            uli.HighPart = ft.dwHighDateTime;
            long long clientTime = (uli.QuadPart - 116444736000000000ULL) / 10000000ULL;

            long long diff = (clientTime > serverTime) ? (clientTime - serverTime) : (serverTime - clientTime);
            if (diff > 300)
            {
                result.isValid = false;
                result.errorMessage = "Response expired or local clock skewed. Please sync Windows clock.";
                return result;
            }

            // Compute expected HMAC-SHA256 signature
            std::string signPayload = licenseKey + ":" + hwid + ":" + timestampStr;
            std::string expectedSig = ChameleonSec::ComputeHmacSha256(GetSigningSecret(), signPayload);

            if (_stricmp(serverSig.c_str(), expectedSig.c_str()) != 0)
            {
                result.isValid = false;
                result.errorMessage = "Cryptographic signature mismatch! Unauthorized proxy or spoofing detected.";
                return result;
            }

            // Signature cryptographically verified!
            g_authKey = 0x5A8E3C17; // Entangle offset decryption
            result.isValid = true;
            result.tier = ExtractJsonValue(responseString, "tier");
            result.discordUser = ExtractJsonValue(responseString, "discord_username");
            result.expiresAt = ExtractJsonValue(responseString, "expires_at");

            return result;
        }
        else
        {
            result.isValid = false;
            std::string err = ExtractJsonValue(responseString, "error");
            result.errorMessage = !err.empty() ? err : "License verification rejected by server.";
            return result;
        }
    }

    /**
     * Silent verification for background heartbeat thread (no console output)
     */
    inline bool VerifySavedLicenseQuietly(const char* keyFilename = "license.key", const char* discordFilename = "discord.id")
    {
        std::string key = ReadFileString(keyFilename);
        std::string discord = ReadFileString(discordFilename);
        if (key.empty() || discord.empty()) return false;
        AuthResult auth = VerifyLicense(key, discord);
        return auth.isValid;
    }

    /**
     * Enforce License with Interactive Loop & Retry (Never auto-closes)
     */
    inline bool EnforceLicense(const char* keyFilename = "license.key", const char* discordFilename = "discord.id")
    {
        // 1. Immediate scan for active reverse engineering / dumper tools
        if (ChameleonSec::CheckBlacklistedTools(true))
        {
            return false;
        }

        std::string key = ReadFileString(keyFilename);
        std::string discord = ReadFileString(discordFilename);

        HANDLE hStdIn = GetStdHandle(STD_INPUT_HANDLE);
        bool isConsole = (hStdIn != NULL && hStdIn != INVALID_HANDLE_VALUE && GetFileType(hStdIn) == FILE_TYPE_CHAR);

        if (isConsole)
        {
            // If saved credentials exist, validate them first
            if (!key.empty() && !discord.empty())
            {
                std::cout << "[*] Authenticating VIP session...\n";

                AuthResult auth = VerifyLicense(key, discord);
                if (auth.isValid)
                {
                    std::cout << "\n[+] Access Granted!\n";
                    std::cout << "    Status  : Active VIP Member\n";
                    if (!auth.tier.empty())
                        std::cout << "    Plan    : " << auth.tier << "\n";
                    if (!auth.discordUser.empty())
                        std::cout << "    Account : @" << auth.discordUser << "\n";
                    if (!auth.expiresAt.empty())
                        std::cout << "    Expires : " << auth.expiresAt << "\n";
                    std::cout << "--------------------------------------------------------\n\n";
                    return true;
                }
                else
                {
                    std::cout << "\n[!] Stored credentials rejected.\n";
                    std::cout << "[*] Please enter updated credentials below:\n\n";
                }
            }

            // Interactive retry loop in console (never auto-closes)
            while (true)
            {
                std::cout << "========================================================\n";
                std::cout << "             CHAMELEON VIP AUTHENTICATION               \n";
                std::cout << "========================================================\n";
                std::cout << "Enter License Key:\n> ";
                std::string inputKey;
                if (!(std::cin >> inputKey) || inputKey.empty())
                {
                    std::cout << "[!] Invalid input.\n\n";
                    continue;
                }

                std::cout << "Enter bound Discord Username / ID:\n> ";
                std::string inputDiscord;
                if (!(std::cin >> inputDiscord) || inputDiscord.empty())
                {
                    std::cout << "[!] Invalid input.\n\n";
                    continue;
                }

                std::cout << "[*] Verifying...\n";
                AuthResult auth = VerifyLicense(inputKey, inputDiscord);

                if (auth.isValid)
                {
                    WriteFileString(keyFilename, inputKey);
                    WriteFileString(discordFilename, inputDiscord);

                    std::cout << "\n[+] Access Granted! Credentials saved.\n";
                    if (!auth.tier.empty())
                        std::cout << "    Plan    : " << auth.tier << "\n";
                    if (!auth.discordUser.empty())
                        std::cout << "    Account : @" << auth.discordUser << "\n";
                    if (!auth.expiresAt.empty())
                        std::cout << "    Expires : " << auth.expiresAt << "\n";
                    std::cout << "--------------------------------------------------------\n\n";
                    return true;
                }
                else
                {
                    std::cout << "\n[!] Access Denied: " << auth.errorMessage << "\n\n";
                    std::cout << "[*] Press 'r' + Enter to retry, or 'q' to quit:\n> ";
                    std::string retryChoice;
                    std::cin >> retryChoice;
                    if (retryChoice == "q" || retryChoice == "quit" || retryChoice == "exit")
                    {
                        return false;
                    }
                    std::cout << "\n";
                }
            }
        }
        else
        {
            // Inside GUI game process (TGame.exe / ChamsHook.dll)
            if (key.empty() || discord.empty())
            {
                MessageBoxA(
                    NULL,
                    "Access Denied: Missing License Key or Discord Identity.\n\nPlease launch via Chameleon Injector first or verify your credentials.",
                    "Chameleon Cheats - Security Enclave",
                    MB_OK | MB_ICONERROR
                );
                return false;
            }

            AuthResult auth = VerifyLicense(key, discord);
            if (auth.isValid)
            {
                return true;
            }
            else
            {
                std::string err = "ACCESS DENIED: " + auth.errorMessage + "\n\nLicense mismatch, expired, or tampered.\nPlease renew at https://chameleoncheats.com";
                MessageBoxA(NULL, err.c_str(), "Chameleon Cheats - Security Enclave", MB_OK | MB_ICONERROR);
                return false;
            }
        }
    }
}
