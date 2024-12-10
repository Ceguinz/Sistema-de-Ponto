import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Usuario } from '../types';
import { UserPlus } from 'lucide-react';
import { UsuarioForm } from '../components/UsuarioForm';
import { UsuarioList } from '../components/UsuarioList';

export function Usuarios() {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [ra, setRa] = useState('');
  const [emailAcademico, setEmailAcademico] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Usuario));
      setUsuarios(usuariosData);
      setMensagem('');
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setMensagem('Erro ao carregar usuários.');
    }
  };

  const cadastrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !funcao || !ra || !emailAcademico) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    try {
      if (editando) {
        await updateDoc(doc(db, 'usuarios', editando), {
          nome,
          funcao,
          ra,
          emailAcademico
        });
        setMensagem('Usuário atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'usuarios'), {
          nome,
          funcao,
          ra,
          emailAcademico
        });
        setMensagem('Usuário cadastrado com sucesso!');
      }

      setNome('');
      setFuncao('');
      setRa('');
      setEmailAcademico('');
      setEditando(null);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setMensagem('Erro ao salvar usuário.');
    }
  };

  const excluirUsuario = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteDoc(doc(db, 'usuarios', id));
        setMensagem('Usuário excluído com sucesso!');
        carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        setMensagem('Erro ao excluir usuário.');
      }
    }
  };

  const editarUsuario = (usuario: Usuario) => {
    setNome(usuario.nome);
    setFuncao(usuario.funcao);
    setRa(usuario.ra);
    setEmailAcademico(usuario.emailAcademico);
    setEditando(usuario.id);
    setMensagem('');
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setNome('');
    setFuncao('');
    setRa('');
    setEmailAcademico('');
    setMensagem('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UserPlus size={24} />
            {editando ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
          </h2>

          {mensagem && (
            <div className={`mb-4 p-3 rounded-md ${
              mensagem.includes('Erro') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {mensagem}
            </div>
          )}
          
          <UsuarioForm
            nome={nome}
            funcao={funcao}
            ra={ra}
            emailAcademico={emailAcademico}
            editando={editando}
            onNomeChange={setNome}
            onFuncaoChange={setFuncao}
            onRaChange={setRa}
            onEmailAcademicoChange={setEmailAcademico}
            onSubmit={cadastrarUsuario}
            onCancelar={cancelarEdicao}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Usuários Cadastrados</h2>
          {usuarios.length > 0 ? (
            <UsuarioList
              usuarios={usuarios}
              onEditar={editarUsuario}
              onExcluir={excluirUsuario}
            />
          ) : (
            <p className="text-center text-gray-500">Nenhum usuário cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}