-- Criar tabela de usuários para login
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de materiais de construção
CREATE TABLE IF NOT EXISTS materiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    quantidade INT NOT NULL DEFAULT 0,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unidade VARCHAR(20) DEFAULT 'unidade',
    categoria VARCHAR(50),
    fornecedor VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (username, password) VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Inserir alguns materiais de exemplo
INSERT INTO materiais (nome, descricao, quantidade, preco, unidade, categoria, fornecedor) VALUES
('Cimento CPV', 'Cimento Portland de alta resistência', 500, 25.50, 'saco', 'Materiais Básicos', 'LafargeHolcim'),
('Tijolo Cerâmico', 'Tijolo vazado 9x19x19cm', 2000, 0.85, 'unidade', 'Materiais Básicos', 'Cerâmica São João'),
('Areia Média', 'Areia lavada para construção', 15, 120.00, 'm³', 'Agregados', 'Mineração Silva'),
('Brita 1', 'Pedra britada para concreto', 20, 95.00, 'm³', 'Agregados', 'Pedreira Nova'),
('Cabo Elétrico 2.5mm', 'Cabo flexível 750V', 500, 3.20, 'metro', 'Elétrica', 'Prysmian'),
('Tinta Acrílica Branca', 'Tinta para parede interna', 50, 89.90, 'galão', 'Acabamento', 'Suvinil'),
('Telha de Barro', 'Telha colonial tradicional', 300, 2.50, 'unidade', 'Cobertura', 'Telhas Brasil'),
('Ferro 5/16', 'Barra de ferro para concreto armado', 100, 18.75, 'barra', 'Aço', 'Gerdau')
