import axios from "axios";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const DashboardInternal = () => {
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [info, setInfo] = useState("");
  const [totalDataResponden, setTotalDataResponden] = useState(0);
  const [totalDataSelesai, setTotalDataSelesai] = useState(0);
  const [totalDataDalamProses, setTotalDataDalamProses] = useState(0);
  const [totalDataBelumMulai, setTotalDataBelumMulai] = useState(0);
  const [current, setCurrent] = useState(1);
  const [responden, setResponden] = useState([""]);
  const [selesai, setSelesai] = useState([""]);
  const [dalamProses, setDalamProses] = useState([""]);
  const [belumMulai, setBelumMulai] = useState([""]);
  const [companyList, setCompanyList] = useState([""]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [type, setType] = useState("");
  const [pieChart, setPieChart] = useState("");
  const [barChart, setBarChart] = useState("");
  const [scatter, setScatter] = useState("");
  const [mind, setMind] = useState("");
  const [heart, setHeart] = useState("");
  const [soul, setSoul] = useState("");
  const [search, setSearch] = useState("");
  const { id } = useParams();

  const dataType =
    type === "responden"
      ? responden
      : type === "mulai"
      ? belumMulai
      : type === "proses"
      ? dalamProses
      : selesai;

  const getDataSelesai = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 16,
          search: searchIndex,
          limit: pageSize ?? 10,
          page: pageIndex ?? 1,
        },
      })
      .then((res) => {
        res.data == 0 ? setSelesai([]) : setSelesai(res.data.data);
        setTotalDataSelesai(res.data.totaldata);
        setLoading(false);
      });
  };

  const getDataResponden = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 15,
          search: searchIndex,
          limit: pageSize ?? 10,
          page: pageIndex ?? 1,
        },
      })
      .then((res) => {
        res.data == 0 ? setResponden([]) : setResponden(res.data.data);
        setTotalDataResponden(res.data.totaldata);
        setLoading(false);
      });
  };

  const getDataDalamProses = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 17,
          search: searchIndex,
          limit: pageSize ?? 10,
          page: pageIndex ?? 1,
        },
      })
      .then((res) => {
        res.data == 0 ? setDalamProses([]) : setDalamProses(res.data.data);
        setTotalDataDalamProses(res.data.totaldata);
        setLoading(false);
      });
  };

  const getDataBelumMulai = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 18,
          search: searchIndex,
          limit: pageSize ?? 10,
          page: pageIndex ?? 1,
        },
      })
      .then((res) => {
        console.log(res.data);
        res.data == 0 ? setBelumMulai([]) : setBelumMulai(res.data.data);
        setTotalDataBelumMulai(res.data.totaldata);
        setLoading(false);
      });
  };

  const handleSelect = (company) => {
    setLoadingChart(true);
    setSelectedCompany(company);
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 21,
          company: company,
        },
      })
      .then((res) => {
        setScatter(res.data);
        setLoadingChart(false);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 23,
          company: company,
          type: "mind",
        },
      })
      .then((res) => {
        setMind(res.data);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 23,
          company: company,
          type: "heart",
        },
      })
      .then((res) => {
        setHeart(res.data);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 23,
          company: company,
          type: "soul",
        },
      })
      .then((res) => {
        setSoul(res.data);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 1,
        },
      })
      .then((res) => {
        setInfo(res.data);
        setLoading(false);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 8,
        },
      })
      .then((res) => {
        setCompanyList(res.data);
        setLoading(false);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 20,
        },
      })
      .then((res) => {
        setBarChart(res.data);
        setLoading(false);
      });
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 22,
        },
      })
      .then((res) => {
        setPieChart(res.data);
        setLoading(false);
      });
  }, []);

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData, fileName);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, fileName + ".xlsx");
    setLoadingButton(false);
  };

  const handleExport = () => {
    setLoadingButton(true);
    if (type === "responden") {
      axios
        .get(`${process.env.REACT_APP_URL}`, {
          params: {
            id_survey: id,
            sel: 15,
            search: "",
            limit: totalDataResponden,
            page: 1,
          },
        })
        .then((res) => {
          const fileExport = res?.data?.data?.map((item) => ({
            name: item.firstname,
            email: item.email,
            status: item.status,
            company: item.attribute_2,
          }));
          exportToCSV(fileExport, "data-responden");
        });
    } else if (type === "mulai") {
      axios
        .get(`${process.env.REACT_APP_URL}`, {
          params: {
            id_survey: id,
            sel: 18,
            search: "",
            limit: totalDataBelumMulai,
            page: 1,
          },
        })
        .then((res) => {
          const fileExport = res?.data?.data?.map((item) => ({
            name: item.firstname,
            email: item.email,
            status: item.status,
            company: item.attribute_2,
          }));
          exportToCSV(fileExport, "data-belum-mulai");
        });
    } else if (type === "proses") {
      axios
        .get(`${process.env.REACT_APP_URL}`, {
          params: {
            id_survey: id,
            sel: 17,
            search: "",
            limit: totalDataDalamProses,
            page: 1,
          },
        })
        .then((res) => {
          const fileExport = res?.data?.data?.map((item) => ({
            name: item.firstname,
            email: item.email,
            status: item.status,
            company: item.attribute_2,
          }));
          exportToCSV(fileExport, "data-dalam-proses");
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_URL}`, {
          params: {
            id_survey: id,
            sel: 16,
            search: "",
            limit: totalDataSelesai,
            page: 1,
          },
        })
        .then((res) => {
          const fileExport = res?.data?.data?.map((item) => ({
            name: item.firstname,
            email: item.email,
            status: item.status,
            company: item.attribute_2,
          }));
          exportToCSV(fileExport, "data-selesai");
        });
    }
  };

  const dataPie = {
    labels: pieChart.label,
    datasets: [
      {
        backgroundColor: ["#B2E672", "#FFFD88", "#FF8C8C"],
        hoverBackgroundColor: ["#B6E2A1", "#FFFBC1", "#F7A4A4"],
        data: pieChart.data,
      },
    ],
  };

  const dataBar = {
    labels: barChart.list_bu,
    datasets: [
      {
        label: "Selesai",
        data: barChart.finish,
        backgroundColor: "#B2E672",
      },
      {
        label: "Dalam Proses",
        data: barChart.on_progress,
        backgroundColor: "#FFFD88",
      },
      {
        label: "Belum Mulai",
        data: barChart.not_started,
        backgroundColor: "#FF8C8C",
      },
    ],
    options: {
      indexAxis: "y",
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  };

  return (
    <>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <div className="col-xl-12 col-md-6 p-3">
            <div className="card border-left-presentase shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <div className="text-xs fw-bold text-uppercase mb-1">
                      Persentase Penyelesaian
                    </div>
                    <div className="d-flex justify-content-start">
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {info.percentage}%
                      </div>
                      <div class="progress w-100 mt-1 ms-2">
                        <div
                          class="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${info.percentage}%`,
                            backgroundColor: "#0E8388",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i class="fas fa-tasks fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row px-3">
            <div className="col-xl-3 col-md-6 mb-4">
              <div
                className="card border-left-responden shadow h-100 py-2 pointer"
                onClick={() => (
                  setType("responden"),
                  setCurrent(1),
                  getDataResponden(10, 1, search),
                  setLoading(true)
                )}
              >
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1">
                        Total Responden
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {info.total}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i class="fas fa-users fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div
                className="card border-left-selesai shadow h-100 py-2 pointer"
                onClick={() => (
                  setType("selesai"),
                  setCurrent(1),
                  getDataSelesai(10, 1, search),
                  setLoading(true)
                )}
              >
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1">
                        Total Selesai
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {info.finish}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i class="fas fa-check fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div
                className="card border-left-proses shadow h-100 py-2 pointer"
                onClick={() => (
                  setType("proses"),
                  setCurrent(1),
                  getDataDalamProses(10, 1, search),
                  setLoading(true)
                )}
              >
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1">
                        Total Dalam Proses
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {info.progress}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i class="fas fa-edit fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div
                className="card border-left-mulai shadow h-100 py-2 pointer"
                onClick={() => (
                  setType("mulai"),
                  setCurrent(1),
                  getDataBelumMulai(10, 1, search),
                  setLoading(true)
                )}
              >
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="text-xs fw-bold text-uppercase mb-1">
                        Total Belum Mulai
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {info.not_started}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i class="fas fa-times fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mx-3">
            <div className="col card border-0 me-3 shadow-lg">
              <div className="card-body d-flex justify-content-center">
                <Pie data={dataPie} className="pie-chart my-auto" />
              </div>
            </div>
            <div className="col-7 card border-0 shadow-lg">
              <div className="card-body d-flex justify-content-center scroll">
                <Bar
                  data={dataBar}
                  options={dataBar.options}
                  className="bar-chart my-auto"
                />
              </div>
            </div>
          </div>

          <div className="card border-0 p-4 mx-3 shadow-lg my-3">
            <p className="mb-1">Generate Chart</p>
            <select
              className="form-select"
              onChange={(e) => handleSelect(e.target.value)}
            >
              {companyList.map((item) => (
                <option value={item.company}>{item.company}</option>
              ))}
            </select>

            {selectedCompany && loadingChart === false ? (
              <div>
                <div className="row">
                  <div className="col mt-4">
                    <div className="mapping-grid">
                      <div className="commitment-box">
                        <p className="text-commitment">Commitment</p>
                        <div className="commitment-top"></div>
                        <div className="commitment-bottom"></div>
                      </div>
                      <div className="satisfaction-box">
                        <p style={{ fontSize: "24px" }}>Satisfaction</p>
                        <div className="satisfaction-right"></div>
                        <div className="satisfaction-left"></div>
                      </div>
                      <div
                        className="card p-3 text-center border-0"
                        style={{
                          borderRadius: "25px",
                          backgroundColor: "#052935",
                        }}
                      >
                        <span className="text-white fs-5 mt-auto">
                          Potentially
                          <br /> Engaged
                        </span>
                        <div className="bg-white w-50 mx-auto mt-2 mb-auto text-secondary">
                          {scatter?.scatter?.potentiallyEngaged}
                        </div>
                      </div>
                      <div
                        className="card p-3 text-center border-0"
                        style={{
                          borderRadius: "25px",
                          backgroundColor: "#cd2330",
                        }}
                      >
                        <span className="text-white fs-5 mt-auto">
                          Actively
                          <br /> Engaged
                        </span>
                        <div className="bg-white w-50 mx-auto mt-2 mb-auto text-secondary">
                          {scatter?.scatter?.activelyEngaged}
                        </div>
                      </div>
                      <div
                        className="card p-3 text-center border-0"
                        style={{
                          borderRadius: "25px",
                          backgroundColor: "#f3c416",
                        }}
                      >
                        <span className="text-white fs-5 mt-auto">
                          Disengaged
                        </span>
                        <div className="bg-white w-50 mx-auto mt-2 mb-auto text-secondary">
                          {scatter?.scatter?.Disengaged}
                        </div>
                      </div>
                      <div
                        className="card p-3 text-center border-0"
                        style={{
                          borderRadius: "25px",
                          backgroundColor: "#0566",
                        }}
                      >
                        <span className="text-white fs-5 mt-auto">
                          Passively
                          <br /> Engaged
                        </span>
                        <div className="bg-white w-50 mx-auto mt-2 mb-auto text-secondary">
                          {scatter?.scatter?.passivelyEngaged}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-5">
                    <table
                      className="table table-striped table-secondary"
                      style={{ marginTop: "5rem" }}
                    >
                      <thead className="bg-success">
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Average Satisfaction</td>
                          <td>{scatter?.box?.averageSatisfaction}</td>
                        </tr>
                        <tr>
                          <td>Average Commitment</td>
                          <td>{scatter?.box?.averageCommitment}</td>
                        </tr>
                        <tr>
                          <td>Engagement Index</td>
                          <td>{scatter?.box?.engagementIndex}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <div className="card shadow p-3 mt-5">
                  <p className="fs-5 fw-bold mb-1">
                    Employer Branding 1.0 (Mind)
                  </p>
                  <div className="d-flex my-3">
                    <p className="my-auto text-xs">
                      Saya mengetahui dan memahami tujuan dan <br/>misi perusahaan
                      tempat saya bekerja saat ini
                    </p>
                    <Bar
                      data={{
                        labels: [
                          "Saya mengetahui dan memahami tujuan dan misi perusahaan tempat saya bekerja saat ini",
                        ],
                        datasets: [
                          {
                            label: "mind",
                            data: [mind.avg],
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y",
                        scales: {
                          y: {
                            display: false, // Hide Y axis labels
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                      className="bar-employer"
                    />
                  </div>
                  <p>{mind.message}</p>
                </div>
                <div className="card shadow p-3 mt-3">
                  <p className="fs-5 fw-bold mb-1">
                    Employer Branding 2.0 (Heart)
                  </p>
                  <div className="d-flex my-3">
                    <p className="my-auto text-xs">
                      Saya merasa senang menjadi <br />
                      bagian dari perusahaan saya saat ini
                    </p>
                    <Bar
                      data={{
                        labels: ["heart"],
                        datasets: [
                          {
                            label: "heart",
                            data: [heart.avg],
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y",
                        scales: {
                          y: {
                            display: false, // Hide Y axis labels
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                      className="bar-employer"
                    />
                  </div>
                  <p>{heart.message}</p>
                </div>
                <div className="card shadow p-3 mt-3">
                  <p className="fs-5 fw-bold mb-1">
                    Employer Branding 3.0 (Soul)
                  </p>
                  <div className="d-flex my-3">
                    <p className="my-auto text-xs">
                      Saya bersedia untuk merekomendasikan perusahaan ini <br/>kepada
                      orang lain sebagai "Best place to work"
                    </p>
                    <Bar
                      data={{
                        labels: ["soul"],
                        datasets: [
                          {
                            label: "soul",
                            data: [soul.avg],
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y",
                        scales: {
                          y: {
                            display: false, // Hide Y axis labels
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                      className="bar-employer"
                    />
                  </div>
                  <p>{soul.message}</p>
                </div> */}
              </div>
            ) : loadingChart === true ? (
              <div className="text-center p-4">
                <Spinner animation="border" />
              </div>
            ) : (
              ""
            )}
          </div>

          {type ? (
            <div className="card border-0 py-2 mx-3 shadow-lg my-3">
              <div className="card-body">
                <p className="text-blue fw-bold">
                  Data{" "}
                  {type === "mulai"
                    ? "Belum Mulai"
                    : type === "responden"
                    ? "Responden"
                    : type === "proses"
                    ? "Dalam Proses"
                    : "Selesai"}
                </p>
                <div className="d-flex justify-content-between">
                  <div className="input-group w-75">
                    <input
                      className="form-control border"
                      placeholder="Search"
                      onChange={(e) => {
                        setSearch(e.target.value);
                        type === "mulai"
                          ? getDataBelumMulai(10, 1, e.target.value)
                          : type === "responden"
                          ? getDataResponden(10, 1, e.target.value)
                          : type === "proses"
                          ? getDataDalamProses(10, 1, e.target.value)
                          : getDataSelesai(10, 1, e.target.value);
                      }}
                    />
                    <span className="input-group-text">
                      <i class="fas fa-search text-secondary"></i>
                    </span>
                  </div>
                  <button
                    className="btn bg-blue text-white px-3 ms-2"
                    onClick={handleExport}
                  >
                    {loadingButton === true ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Export Excel"
                    )}
                  </button>
                </div>
                <table class="table table-striped table-light mt-3 rounded rounded-3">
                  <thead>
                    <tr className="text-center bg-success">
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Status</th>
                      <th scope="col">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataType.map((item) => (
                      <tr>
                        <th className="fw-normal">{item.firstname}</th>
                        <th className="fw-normal">{item.email}</th>
                        <th className="fw-normal">{item.status}</th>
                        <th className="fw-normal">{item.attribute_2}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationControl
                  page={current}
                  total={
                    type === "responden"
                      ? totalDataResponden
                      : type === "mulai"
                      ? totalDataBelumMulai
                      : type === "proses"
                      ? totalDataDalamProses
                      : totalDataSelesai
                  }
                  limit={10}
                  changePage={(page, size) => {
                    type === "mulai"
                      ? getDataBelumMulai(size, page, search)
                      : type === "responden"
                      ? getDataResponden(size, page, search)
                      : type === "proses"
                      ? getDataDalamProses(size, page, search)
                      : getDataSelesai(size, page, search);
                    setCurrent(page);
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default DashboardInternal;
