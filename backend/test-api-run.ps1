# Script completo de testes - Todos os endpoints da API
Write-Host "===== SUITE COMPLETA DE TESTES API ClickUp =====" -ForegroundColor Magenta
Write-Host "Testando: Users, Comments, Tags" -ForegroundColor Gray
Write-Host ""

$testsTotal = 0
$testsPassed = 0
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# ==================== SEÇÃO 1: TAREFAS ====================
Write-Host "SEÇÃO 1: TESTES DE TAREFAS" -ForegroundColor Cyan
Write-Host ""

# TEST 1: GET /tasks
Write-Host "TEST 1: GET /tasks" -ForegroundColor Yellow
$testsTotal++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method GET
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $tasks = $response.Content | ConvertFrom-Json
    Write-Host "  Total de Tarefas: $($tasks.Count)" -ForegroundColor Cyan
    $testsPassed++
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 2: GET /tasks/stats
Write-Host "TEST 2: GET /tasks/stats" -ForegroundColor Yellow
$testsTotal++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/stats" -Method GET
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $stats = $response.Content | ConvertFrom-Json
    Write-Host "  Total: $($stats.totalTasks) | Concluidas: $($stats.completedTasks)" -ForegroundColor Cyan
    $testsPassed++
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 3: POST /tasks (Criar Tarefa)
Write-Host "TEST 3: POST /tasks (Criar Tarefa)" -ForegroundColor Yellow
$testsTotal++
try {
    $body = @{
        "titulo" = "Tarefa Teste $((Get-Random))"
        "descricao" = "Descricao da tarefa de teste $((Get-Random))"
        "id_estado_tarefa" = 1
        "id_prioridade" = 2
        "id_categoria" = 1
        "id_projeto" = 1
        "horas_estimadas" = 5
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -ErrorAction Stop
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $task = $response.Content | ConvertFrom-Json
    Write-Host "  ID: $($task.id)" -ForegroundColor Cyan
    $testsPassed++
    $newTaskId = $task.id
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# ==================== SEÇÃO 2: UTILIZADORES ====================
Write-Host "SEÇÃO 2: TESTES DE UTILIZADORES" -ForegroundColor Cyan
Write-Host ""

# TEST 4: GET /users
Write-Host "TEST 4: GET /users" -ForegroundColor Yellow
$testsTotal++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method GET
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $users = $response.Content | ConvertFrom-Json
    Write-Host "  Utilizadores: $($users.Count)" -ForegroundColor Cyan
    $testsPassed++
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 5: GET /users/stats
Write-Host "TEST 5: GET /users/stats" -ForegroundColor Yellow
$testsTotal++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users/stats" -Method GET
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $stats = $response.Content | ConvertFrom-Json
    Write-Host "  Total: $($stats.totalUsers) | Ativos: $($stats.activeUsers) | Taxa: $($stats.activePercentage)" -ForegroundColor Cyan
    $testsPassed++
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 6: POST /users (Criar novo utilizador)
Write-Host "TEST 6: POST /users (Criar Utilizador)" -ForegroundColor Yellow
$testsTotal++
try {
    $body = @{
        nome = "Teste User $((Get-Random))"
        email = "teste$(Get-Random)@test.com"
        telefone = "987654321"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -ErrorAction Stop
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $user = $response.Content | ConvertFrom-Json
    Write-Host "  ID: $($user.id)" -ForegroundColor Cyan
    $testsPassed++
    $newUserId = $user.id
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 7: PUT /users/:id (Atualizar utilizador)
Write-Host "TEST 7: PUT /users/:id (Atualizar Utilizador)" -ForegroundColor Yellow
$testsTotal++
if ($null -ne $newUserId) {
    try {
        $body = @{
            "nome" = "Utilizador Atualizado"
            "email" = "atualizado$((Get-Random))@test.com"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$newUserId" `
            -Method PUT `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -ErrorAction Stop
        Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP Pulado (usuario nao foi criado)" -ForegroundColor Gray
}

Write-Host ""

# TEST 8: PATCH /users/:id (Toggle Active)
Write-Host "TEST 8: PATCH /users/:id (Toggle Active)" -ForegroundColor Yellow
$testsTotal++
if ($null -ne $newUserId) {
    try {
        $body = @{
            activo = 1
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$newUserId" `
            -Method PATCH `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -ErrorAction Stop
        Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP Pulado (usuario nao foi criado)" -ForegroundColor Gray
}

Write-Host ""

# TEST 9: DELETE /users/:id (Deletar Utilizador)
Write-Host "TEST 9: DELETE /users/:id (Deletar Utilizador)" -ForegroundColor Yellow
$testsTotal++
if ($null -ne $newUserId) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/users/$newUserId" `
            -Method DELETE `
            -ErrorAction Stop
        Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "  Utilizador deletado com sucesso" -ForegroundColor Cyan
        $testsPassed++
    } catch {
        Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP Pulado (usuario nao foi criado)" -ForegroundColor Gray
}

Write-Host ""

# ==================== SEÇÃO 3: COMENTARIOS E TAGS ====================
Write-Host "SEÇÃO 3: TESTES DE COMENTARIOS E TAGS" -ForegroundColor Cyan
Write-Host ""

# TEST 10: GET /tags
Write-Host "TEST 10: GET /tags" -ForegroundColor Yellow
$testsTotal++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tags" -Method GET
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $tags = $response.Content | ConvertFrom-Json
    Write-Host "  Total Tags: $($tags.Count)" -ForegroundColor Cyan
    $testsPassed++
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 11: POST /tags (Criar Tag)
Write-Host "TEST 11: POST /tags (Criar Tag)" -ForegroundColor Yellow
$testsTotal++
try {
    $body = @{
        nome = "Tag Teste $((Get-Random))"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tags" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -ErrorAction Stop
    Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
    $tag = $response.Content | ConvertFrom-Json
    Write-Host "  ID: $($tag.id)" -ForegroundColor Cyan
    $testsPassed++
    $newTagId = $tag.id
} catch {
    Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# TEST 12: DELETE /tags/:id (Remover Tag)
Write-Host "TEST 12: DELETE /tags/:id (Remover Tag)" -ForegroundColor Yellow
$testsTotal++
if ($null -ne $newTagId) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/tags/$newTagId" `
            -Method DELETE `
            -ErrorAction Stop
        Write-Host "OK Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "  Tag deletada com sucesso" -ForegroundColor Cyan
        $testsPassed++
    } catch {
        Write-Host "FAIL Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP Pulado (tag nao foi criada)" -ForegroundColor Gray
}

Write-Host ""

# ==================== RESUMO FINAL ====================
Write-Host "RESUMO FINAL DOS TESTES" -ForegroundColor Magenta
Write-Host ""
Write-Host "Total de Testes: $testsTotal" -ForegroundColor White
Write-Host "Testes Passados: $testsPassed / $testsTotal" -ForegroundColor Green

$percentual = if ($testsTotal -gt 0) { [math]::Round(($testsPassed / $testsTotal) * 100, 1) } else { 0 }
Write-Host "Taxa de Sucesso: $percentual%" -ForegroundColor Cyan

if ($testsPassed -eq $testsTotal) {
    Write-Host "`nPASS TODOS OS TESTES PASSARAM!" -ForegroundColor Green
} else {
    Write-Host "`nWARN $($testsTotal - $testsPassed) teste(s) falharam" -ForegroundColor Yellow
    Write-Host "Taxa de Sucesso: $percentual%" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host ""
