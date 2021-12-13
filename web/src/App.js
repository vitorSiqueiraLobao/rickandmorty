import React from "react";
import { FormGroup, Paper, Button } from "@material-ui/core";
import TransferList from "./components/TransferList";
import Filter from "./components/Filter";
import Table from "./components/Table";
import "./App.css";

export default function App() {
  const [selections, setSelections] = React.useState([]);
  const [table, setTable] = React.useState([]);
  const [filtros, setFiltros] = React.useState([]);
  const [filtrosValues, setFiltrosValues] = React.useState([{}]);
  const [loading, setLoading] = React.useState(false);
  const [aux, setAux] = React.useState({
    id: -1,
    selection: "a",
    comparator: "a",
    constraint: "a",
  });
  const [level, setLevel] = React.useState(0);

  React.useEffect(() => {
    if (aux.id !== -1) {
      let auxFiltros = filtrosValues;
      auxFiltros[aux.id] = {
        selection: aux.selection,
        comparator: aux.comparator,
        constraint: aux.constraint,
      };
      setFiltrosValues(auxFiltros);
    }
  }, [aux]);

  function sendRequest() {
    setLoading(true);
    const jsonBody = {
      selections: selections,
      filtros: filtrosValues,
    };
    let data = JSON.stringify(jsonBody);
    fetch("http://localhost:3333/", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((queryJSON) => {
        let data = fixData(queryJSON.return);
        setTable(data);
        setLoading(false);
      });
  }

  return (
    <div className="home-page">
      <div className="main">
        <div className="report">
          {level === 0 && (
            <>
              <h3>Selecione os campos desejados</h3>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLevel(1)}
              >
                Selecionar campos
              </Button>
            </>
          )}
          {level === 1 && (
            <>
              <div className="options">
                <div className="containerTransfer">
                  <div className="transfer">
                    <h2>Selecione as colunas desejadas</h2>
                    <FormGroup>
                      <Paper elevation={5}>
                        <TransferList setFunction={setSelections} />
                      </Paper>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <h3>=Adicionar filtros</h3>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setFiltros([
                    ...filtros,
                    <Filter id={filtros.length} sendValues={setAux} />,
                  ]);
                  setLevel(2);
                }}
              >
                Adicionar
              </Button>
            </>
          )}

          {level === 2 && (
            <>
              <div className="filters">
                <h2>Adicione os filtros na tabela</h2>
                {filtros}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setFiltros([
                      ...filtros,
                      <Filter id={filtros.length} sendValues={setAux} />,
                    ]);
                  }}
                >
                  Adicionar Filtro
                </Button>
              </div>
              <h3>Gerar o Relatório</h3>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  sendRequest();
                  setLevel(3);
                }}
              >
                Gerar Relatório
              </Button>
            </>
          )}

          {level === 3 && (
            <div className="table">
              {!loading && <Table tableData={table} keys={selections} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function fixData(e) {
    let data = e.filter(function (obj) {
      for (var key in obj) {
        if (obj[key] === null) return false;
      }
      return true;
    });

    return data;
  }
}
