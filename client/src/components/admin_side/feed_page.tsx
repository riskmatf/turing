import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {withMainLayout} from "./main_layout";
import {FilterCriteria, useFilterReports} from "../../services/admin_side/i_report_service";
import {useForceRender} from "../../utils/force_render";
import {useCallback, useMemo, useState} from "react";
import {Report} from "../../models/admin_side/report";
import {ReportView} from "./report_view";
import {ListGroup, Row, Col, Modal, ModalHeader, ModalBody} from "reactstrap";
import {Hook} from "../../utils/hook";
import {ServiceLocator} from "../../services/admin_side/service_locator";

type Props =
    Readonly<{

    }> & RouteComponentProps<{}>

const filter: FilterCriteria = {classrooms: [], comments: 'all', fixed: 'notFixed'};

function FeedPage_(props: Props): React.ReactElement
{
    const [value, forceRender] = useForceRender();
    const reportApi = useFilterReports(filter, forceRender);
    const [currentSelectedReport, setCurrentSelectedReport]: Hook<Report | undefined> = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const onToggleModalOpen = useCallback(()=>
    {
        setModalOpen(prevState => !prevState);
    }, [setModalOpen]);

    const onReportSolved = useCallback((idReport: number)=>
    {
        const updater = ServiceLocator.getReportService().updateReport(idReport);
        if(updater.isError())
        {
            throw updater.error;
        }

        updater.value.setFix(true).executeUpdate();
        onToggleModalOpen();
    }, [onToggleModalOpen]);

    const onReportRemoved = useCallback((idReport: number)=>
    {
        ServiceLocator.getReportService().removeReport(idReport);
        onToggleModalOpen();
    }, [onToggleModalOpen]);

    const reportData = useMemo(()=>
    {
        console.log('Regenerating report data...');
        let res: Array<Report> = [];

        if(reportApi.reports.isError())
        {
            throw reportApi.reports.error;
        }
        if(reportApi.reports.value === undefined)
        {
            return res;
        }

        const reports = reportApi.reports.value;
        for(let it = reports.values(), curr = it.next(); !curr.done; curr = it.next())
        {
            res.push(curr.value);
        }

        res = res.filter(value1 => !value1.fixed);

        res.sort((a, b) => a.date - b.date);

        return res;
    }, [value]);

    const reportJSX = useMemo(()=>
    {
        console.log('Regenerating report jsx');

        return reportData.map(value1 => <ReportView report={value1} inline idComputer classroom
                                                    onClick={()=>
                                                    {
                                                        setCurrentSelectedReport(value1);
                                                        onToggleModalOpen();
                                                    }}
        />);
    }, [reportData, setCurrentSelectedReport, onToggleModalOpen]);


    return (
        <React.Fragment>
            <Row className='justify-content-center'>
                <Col xs='12' md='10'>
                    <ListGroup style={{marginBottom: 20}}>
                        {reportJSX}
                    </ListGroup>
                </Col>
            </Row>

            <Modal isOpen={modalOpen} toggle={onToggleModalOpen} contentClassName='full-screen-modal'
                   className='full-screen-modal'
            >
                <ModalHeader toggle={onToggleModalOpen}>
                    Report
                </ModalHeader>

                <ModalBody>
                    {
                       currentSelectedReport !== undefined &&
                           <ReportView report={currentSelectedReport}
                                       soleReport={onReportSolved}
                                       removeReport={onReportRemoved}
                           />
                    }
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
}


export const FeedPage = withMainLayout(FeedPage_);