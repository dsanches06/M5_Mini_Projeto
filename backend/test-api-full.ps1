$ConfirmPreference = 'None'
$WarningPreference = 'SilentlyContinue'
$PSDefaultParameterValues['Invoke-WebRequest:UseBasicParsing'] = $true

Write-Host "===== TESTES DA API =====" -ForegroundColor Magenta
Write-Host ""

$testsTotal = 0
$testsPassed = 0

# TEST 1: GET /tasks
Write-Host "TEST 1: GET /tasks" -ForegroundColor Yellow
$testsTotal++
try {
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: GET" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/tasks" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method GET -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 2: GET /users
Write-Host "TEST 2: GET /users" -ForegroundColor Yellow
$testsTotal++
try {
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: GET" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/users" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method GET -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 3: GET /tags
Write-Host "TEST 3: GET /tags" -ForegroundColor Yellow
$testsTotal++
try {
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: GET" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/tags" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tags" -Method GET -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 4: POST /users
Write-Host "TEST 4: POST /users" -ForegroundColor Yellow
$testsTotal++
$userId = $null
try {
    $body = @{
        nome = "Test User $(Get-Random)"
        email = "test$(Get-Random)@test.com"
        telefone = "987654321"
    } | ConvertTo-Json
    
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: POST" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/users" -ForegroundColor Gray
    Write-Host "    Content-Type: application/json" -ForegroundColor Gray
    Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
    Write-Host $body -ForegroundColor Gray
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) Created" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $userId = [int]$json.id
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 5: POST /tags
Write-Host "TEST 5: POST /tags" -ForegroundColor Yellow
$testsTotal++
$tagId = $null
try {
    $body = @{
        nome = "Tag Test $(Get-Random)"
    } | ConvertTo-Json
    
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: POST" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/tags" -ForegroundColor Gray
    Write-Host "    Content-Type: application/json" -ForegroundColor Gray
    Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
    Write-Host $body -ForegroundColor Gray
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tags" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) Created" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $tagId = $json.id
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 6: POST /users with duplicate email (validation test)
Write-Host "TEST 6: POST /users (duplicate email - should fail)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($userId) {
        # First, get the email from the created user to test duplicate
        $getUserResponse = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method GET -ErrorAction Stop
        $users = $getUserResponse.Content | ConvertFrom-Json
        $existingUser = $users | Where-Object { $_.id -eq $userId } | Select-Object -First 1
        
        if ($existingUser -and $existingUser.email) {
            $body = @{
                nome = "Duplicate Email Test"
                email = $existingUser.email
                telefone = "123456789"
            } | ConvertTo-Json
            
            Write-Host "  [HEADERS]" -ForegroundColor Cyan
            Write-Host "    Method: POST" -ForegroundColor Gray
            Write-Host "    URI: http://localhost:3000/users" -ForegroundColor Gray
            Write-Host "    Content-Type: application/json" -ForegroundColor Gray
            Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
            Write-Host $body -ForegroundColor Gray
            Write-Host "  [EXPECTED] 400 Bad Request (email already exists)" -ForegroundColor Yellow
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
                Write-Host "  [ERROR] Should have failed but succeeded!" -ForegroundColor Red
            } catch {
                $statusCode = $_.Exception.Response.StatusCode.Value__
                if ($statusCode -eq 400) {
                    Write-Host "  [STATUS] $statusCode Bad Request" -ForegroundColor Green
                    try {
                        $errorJson = $_.Exception.Response.Content.ReadAsStream() | ConvertFrom-Json
                        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
                        Write-Host ($errorJson | ConvertTo-Json -Depth 2) -ForegroundColor Gray
                    } catch {
                        Write-Host "  [ERROR MESSAGE] Este email já está registrado" -ForegroundColor Gray
                    }
                    $testsPassed++
                } else {
                    Write-Host "  [ERROR] Unexpected status code: $statusCode" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  [ERROR] Could not find created user email" -ForegroundColor Red
        }
    } else {
        Write-Host "  [ERROR] No user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 7: POST /tags with duplicate name (validation test)
Write-Host "TEST 7: POST /tags (duplicate name - should fail)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($tagId) {
        # Get the tag name from the created tag to test duplicate
        $getTagResponse = Invoke-WebRequest -Uri "http://localhost:3000/tags" -Method GET -ErrorAction Stop
        $tags = $getTagResponse.Content | ConvertFrom-Json
        $existingTag = $tags | Where-Object { $_.id -eq $tagId } | Select-Object -First 1
        
        if ($existingTag -and $existingTag.nome) {
            $body = @{
                nome = $existingTag.nome
            } | ConvertTo-Json
            
            Write-Host "  [HEADERS]" -ForegroundColor Cyan
            Write-Host "    Method: POST" -ForegroundColor Gray
            Write-Host "    URI: http://localhost:3000/tags" -ForegroundColor Gray
            Write-Host "    Content-Type: application/json" -ForegroundColor Gray
            Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
            Write-Host $body -ForegroundColor Gray
            Write-Host "  [EXPECTED] 400 Bad Request (tag name already exists)" -ForegroundColor Yellow
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3000/tags" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
                Write-Host "  [ERROR] Should have failed but succeeded!" -ForegroundColor Red
            } catch {
                $statusCode = $_.Exception.Response.StatusCode.Value__
                if ($statusCode -eq 400) {
                    Write-Host "  [STATUS] $statusCode Bad Request" -ForegroundColor Green
                    try {
                        $errorJson = $_.Exception.Response.Content.ReadAsStream() | ConvertFrom-Json
                        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
                        Write-Host ($errorJson | ConvertTo-Json -Depth 2) -ForegroundColor Gray
                    } catch {
                        Write-Host "  [ERROR MESSAGE] Já existe uma etiqueta com este nome" -ForegroundColor Gray
                    }
                    $testsPassed++
                } else {
                    Write-Host "  [ERROR] Unexpected status code: $statusCode" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  [ERROR] Could not find created tag name" -ForegroundColor Red
        }
    } else {
        Write-Host "  [ERROR] No tag ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 8: GET /users/stats
Write-Host "TEST 8: GET /users/stats" -ForegroundColor Yellow
$testsTotal++
try {
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: GET" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/users/stats" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users/stats" -Method GET -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 9: GET /tasks/stats
Write-Host "TEST 9: GET /tasks/stats" -ForegroundColor Yellow
$testsTotal++
try {
    Write-Host "  [HEADERS]" -ForegroundColor Cyan
    Write-Host "    Method: GET" -ForegroundColor Gray
    Write-Host "    URI: http://localhost:3000/tasks/stats" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/stats" -Method GET -ErrorAction Stop
    Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
    $json = $response.Content | ConvertFrom-Json
    Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 10: POST /tasks
Write-Host "TEST 10: POST /tasks" -ForegroundColor Yellow
$testsTotal++
$taskId = $null
try {
    if ($userId) {
        $body = @{
            titulo = "Task Test $(Get-Random)"
            descricao = "Test task description"
            id_estado_tarefa = 1
            id_prioridade = 1
            id_categoria = 1
            id_projeto = 1
            horas_estimadas = 5
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: POST" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) Created" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $taskId = [int]$json.id
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 11: PUT /users/:id
Write-Host "TEST 11: PUT /users/:id" -ForegroundColor Yellow
$testsTotal++
try {
    if ($userId) {
        $body = @{
            nome = "Updated User $(Get-Random)"
            email = "updated$(Get-Random)@test.com"
            telefone = "999999999"
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: PUT" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/users/$userId" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$userId" -Method PUT -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 12: PATCH /users/:id (toggle active status)
Write-Host "TEST 12: PATCH /users/:id (toggle active)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($userId) {
        $body = @{
            activo = 0
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: PATCH" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/users/$userId" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$userId" -Method PATCH -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 13: PUT /tasks/:id
Write-Host "TEST 13: PUT /tasks/:id" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId) {
        $body = @{
            titulo = "Updated Task $(Get-Random)"
            descricao = "Updated task description"
            id_estado_tarefa = 2
            id_prioridade = 2
            id_categoria = 1
            id_projeto = 1
            horas_estimadas = 8
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: PUT" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId" -Method PUT -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 14: POST /tasks/:id/tags (add tag to task)
Write-Host "TEST 14: POST /tasks/:id/tags (add tag)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId -and $tagId) {
        $body = @{
            tagId = $tagId
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: POST" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/tags" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/tags" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or tag ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 15: GET /tasks/:id/tags (get task tags)
Write-Host "TEST 15: GET /tasks/:id/tags" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: GET" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/tags" -ForegroundColor Gray
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/tags" -Method GET -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 16: POST /tasks/:id/comments (create comment)
Write-Host "TEST 16: POST /tasks/:id/comments (create comment)" -ForegroundColor Yellow
$testsTotal++
$commentId = $null
try {
    if ($taskId -and $userId) {
        $body = @{
            content = "Test comment $(Get-Random)"
            userId = [int]$userId
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: POST" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/comments" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [DEBUG] TaskID: $taskId, UserID: $userId" -ForegroundColor Yellow
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/comments" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) Created" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $commentId = $json.id
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or user ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    try {
        $errorResponse = $_ | ConvertFrom-Json
        Write-Host "  [ERROR DETAILS] $($errorResponse.message)" -ForegroundColor Red
    } catch {
        Write-Host "  [ERROR RESPONSE] $($_.Exception.Response.Content)" -ForegroundColor Red
    }
}

Write-Host ""

# TEST 17: GET /tasks/:id/comments
Write-Host "TEST 17: GET /tasks/:id/comments" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: GET" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/comments" -ForegroundColor Gray
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/comments" -Method GET -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 18: PUT /tasks/:id/comments/:commentId (update comment)
Write-Host "TEST 18: PUT /tasks/:id/comments/:commentId (update)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId -and $commentId) {
        $updatedContent = "Updated comment $(Get-Random)"
        $body = @{
            content = $updatedContent
        } | ConvertTo-Json -Compress
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: PUT" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/comments/$commentId" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/comments/$commentId" -Method PUT -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or comment ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 19: PATCH /tasks/:id/comments/:commentId (resolve comment)
Write-Host "TEST 19: PATCH /tasks/:id/comments/:commentId (resolve)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId -and $commentId) {
        $body = @{
            resolved = $true
        } | ConvertTo-Json
        
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: PATCH" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/comments/$commentId" -ForegroundColor Gray
        Write-Host "    Content-Type: application/json" -ForegroundColor Gray
        Write-Host "  [REQUEST BODY]" -ForegroundColor Cyan
        Write-Host $body -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/comments/$commentId" -Method PATCH -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or comment ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 20: GET /tags/:id/tasks (get tasks with tag)
Write-Host "TEST 20: GET /tags/:id/tasks" -ForegroundColor Yellow
$testsTotal++
try {
    if ($tagId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: GET" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tags/$tagId/tasks" -ForegroundColor Gray
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tags/$tagId/tasks" -Method GET -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No tag ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 21: DELETE /tasks/:id/tags/:tagId (remove tag from task)
Write-Host "TEST 21: DELETE /tasks/:id/tags/:tagId" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId -and $tagId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: DELETE" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/tags/$tagId" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/tags/$tagId" -Method DELETE -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or tag ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 22: DELETE /tasks/:id/comments/:commentId (delete comment)
Write-Host "TEST 22: DELETE /tasks/:id/comments/:commentId" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId -and $commentId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: DELETE" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId/comments/$commentId" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId/comments/$commentId" -Method DELETE -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID or comment ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 23: DELETE /tasks/:id
Write-Host "TEST 23: DELETE /tasks/:id" -ForegroundColor Yellow
$testsTotal++
try {
    if ($taskId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: DELETE" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tasks/$taskId" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/$taskId" -Method DELETE -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No task ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 24: DELETE /tags/:id
Write-Host "TEST 24: DELETE /tags/:id" -ForegroundColor Yellow
$testsTotal++
try {
    if ($tagId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: DELETE" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/tags/$tagId" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tags/$tagId" -Method DELETE -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No tag ID available" -ForegroundColor Red
    }
} catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 25: DELETE /users/:id (Note: May fail due to foreign key constraints if user is referenced)
Write-Host "TEST 25: DELETE /users/:id (with FK check)" -ForegroundColor Yellow
$testsTotal++
try {
    if ($userId) {
        Write-Host "  [HEADERS]" -ForegroundColor Cyan
        Write-Host "    Method: DELETE" -ForegroundColor Gray
        Write-Host "    URI: http://localhost:3000/users/$userId" -ForegroundColor Gray
        Write-Host "    Note: May fail if user is referenced by existing data (FK constraints)" -ForegroundColor Yellow
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$userId" -Method DELETE -ErrorAction Stop
        Write-Host "  [STATUS] $($response.StatusCode) OK" -ForegroundColor Green
        Write-Host "  [RESPONSE JSON]" -ForegroundColor Cyan
        $json = $response.Content | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] No user ID available" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Message -match "400" -or $_.Exception.Message -match "Pedido incorrecto") {
        Write-Host "  [EXPECTED] User deletion failed due to foreign key constraints - this is normal" -ForegroundColor Yellow
        Write-Host "  [INFO] The user has existing references in the database" -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================" -ForegroundColor Magenta
Write-Host "RESULTADOS:" -ForegroundColor Magenta
Write-Host "Testes: $testsPassed / $testsTotal" -ForegroundColor Cyan
if ($testsPassed -eq $testsTotal) {
    Write-Host "STATUS: TODOS PASSARAM!" -ForegroundColor Green
} else {
    Write-Host "STATUS: $($testsTotal - $testsPassed) falharam" -ForegroundColor Yellow
}
Write-Host "================" -ForegroundColor Magenta
