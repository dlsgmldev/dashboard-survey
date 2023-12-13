import axios from "axios";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ExportToExcel } from "../../components/ExportExcel";

const DashboardExternal = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}`, {
        params: {
          id_survey: id,
          sel: 13,
        },
      })
      .then((res) => {
        setInfo(res.data);
        setLoading(false);
      });
  }, []);

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
            <div className="col-xl-4 col-md-6 mb-4">
              <div className="card border-left-responden shadow h-100 py-2">
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
            <div className="col-xl-4 col-md-6 mb-4">
              <div className="card border-left-selesai shadow h-100 py-2">
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
            <div className="col-xl-4 col-md-6 mb-4">
              <div className="card border-left-mulai shadow h-100 py-2">
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
        </div>
      )}
    </>
  );
};

export default DashboardExternal;
