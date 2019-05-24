import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {withMainLayout} from "./main_layout";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    FormGroup,
    Input,
    Label,
    ListGroup,
    Modal, ModalBody, ModalHeader,
    Row
} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {useClassrooms} from "../../services/admin_side/i_classroom_service";
import {useForceRender} from "../../utils/force_render";
import {useCallback, useMemo, useState} from "react";
import {useReports} from "../../services/admin_side/i_report_service";
import {Report} from "../../models/admin_side/report";
import {ReportView} from "./report_view";
import {Hook} from "../../utils/hook";
import {ServiceLocator} from "../../services/admin_side/service_locator";

type Props =
    Readonly<{

    }> & RouteComponentProps<{}>

function ReportsPage_(props: Props): React.ReactElement
{
    const [reportsUpdated, forceRender] = useForceRender();
    const reports = useReports(forceRender);
    const [currentSelectedReport, setCurrentSelectedReport]: Hook<Report | undefined> = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [filters, setFilters]: Hook<FilterResult | undefined> = useState();

    const onToggleModalOpen = useCallback(()=>
    {
        setModalOpen(prevState => !prevState);
    }, [setModalOpen]);

    const onReportSolved = useCallback((idReport: number)=>
    {
        ServiceLocator.getReportService().updateReport(idReport).setFix(true).executeUpdate();
        onToggleModalOpen();
    }, [onToggleModalOpen]);

    const onReportRemoved = useCallback((idReport: number)=>
    {
        ServiceLocator.getReportService().removeReport(idReport);
        onToggleModalOpen();
    }, [onToggleModalOpen]);

    const onFilterChange = useCallback((filter: FilterResult)=>
    {
        console.log(filter);
        setFilters(filter);
    }, [setFilters]);

    const reportsData =  useMemo(()=>
    {
        const arr: Array<Report> = [];
        for(let it = reports.reports.values(), curr = it.next(); !curr.done; curr = it.next())
        {
            arr.push(...curr.value);
        }


        if(filters === undefined)
        {
            return arr;
        }

        return arr.filter(value =>
        {
            let allowClassroom = true;
            let allowComment = true;
            let allowFixed = true;

            if(filters.classrooms.length !== 0)
            {
                const index = filters.classrooms.findIndex(value1=>value1 === value.classroomName);
                allowClassroom = index !== -1;
            }

            if(filters.comments === 'has' && !value.isAdminCommentSet())
            {
                allowComment = false;
            }
            else if(filters.comments === 'dontHave' && value.isAdminCommentSet())
            {
                allowComment = false;
            }

            if(filters.fixed === 'fixed' && !value.fixed)
            {
                allowFixed = false;
            }
            else if(filters.fixed === 'notFixed' && value.fixed)
            {
                allowFixed = false;
            }

            return allowFixed && allowComment && allowClassroom;
        });
    }, [reportsUpdated, filters]);

    const reportJSX = useMemo(()=>
    {
        return reportsData.map(value1 => <ReportView report={value1} inline idComputer classroom
                                                     onClick={()=>
                                                     {
                                                         setCurrentSelectedReport(value1);
                                                         onToggleModalOpen();
                                                     }}
        />);

    }, [reportsData]);

    return (
        <React.Fragment>
            <FilterComponent onApply={onFilterChange}/>

            <Row>
                <Col>
                    <ListGroup>
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
    )
}

export const ReportsPage = withMainLayout(ReportsPage_);

type FilterResult =
    {
        fixed: 'fixed' | 'notFixed' | 'all';
        classrooms: Array<string>;
        comments: 'has' | 'dontHave' | 'all';
    };

type FilterComponentProps =
    Readonly<{
        onApply: (result: FilterResult)=>void;
    }>;

function filterDefault(): FilterResult
{
    return {fixed: 'all', classrooms: [], comments: 'all'};
}

function FilterComponent(props: FilterComponentProps): React.ReactElement
{
    //<editor-fold desc="State">
    const [, forceRender] = useForceRender();
    const classrooms = useClassrooms(forceRender);
    const [isFiltersOpen, setFilterOpen] = useState(false);
    const [filterData, setFilterData]: Hook<FilterResult> =
        useState(filterDefault());

    const onToggleFilters = useCallback(()=>
    {
        setFilterOpen(prevState => !prevState);
    }, [setFilterOpen]);


    const onRadioButtonClicked = useCallback(e =>
    {

        const target = e.target;
        setFilterData(prevState =>
        {
            let res = {...prevState};
            // @ts-ignore
            res[target.name] = target.value;
            return res;
        })
    }, [setFilterData]);

    const onCheckBoxSelected = useCallback((e)=>
    {
        const target = e.target;
        setFilterData(prevState =>
        {
            const res = {...prevState};
            const index = res.classrooms.findIndex(value => value === target.value);
            if(!target.checked)
            {
                if(index === -1)
                {
                    return res;
                }

                res.classrooms.splice(index, 1);
            }
            else
            {
                if(index === -1)
                {
                    res.classrooms.push(target.value);
                }
            }

            return res;
        })
    }, [setFilterData]);

    const onApplyFilter = useCallback(()=>
    {
        props.onApply(filterData);
    }, [props.onApply, setFilterData, filterData]);

    const onResetFilter = useCallback(()=>
    {
        setFilterData(filterDefault());
        props.onApply(filterDefault());
    }, [props.onApply, setFilterData]);

    const classroomsJSX = classrooms.classrooms.map(value =>
    {
        return (
            checkBox(value.name, value.name, onCheckBoxSelected, filterData)
        );
    });


    //</editor-fold>

    return (
        <React.Fragment>
            <Row className='mb-2'>
                <Col>
                    <Card>
                        <CardHeader onClick={onToggleFilters}>
                            <Row className='justify-content-between'>
                                <Col xs='auto'>
                                    Filters
                                </Col>

                                <Col xs='auto'>
                                    {dropArrow(isFiltersOpen)}
                                </Col>
                            </Row>
                        </CardHeader>

                        <Collapse isOpen={isFiltersOpen}>
                            <CardBody>
                                {/*Filters row*/}
                                <Row className='mb-2'>
                                        {/*Fixed filter*/}
                                        <Col xs='12' md='4'>
                                            <Row>
                                                <Col>
                                                    Fixed?
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col>
                                                    {radioButton('Fixed', 'fixed',
                                                        'fixed', onRadioButtonClicked , filterData)}
                                                    {radioButton('Not fixed', 'fixed',
                                                        'notFixed',onRadioButtonClicked, filterData)}
                                                    {radioButton('All', 'fixed',
                                                        'all', onRadioButtonClicked, filterData)}
                                                </Col>
                                            </Row>
                                </Col>

                                    {/*Classroom filter*/}
                                    <Col xs='12' md='4'>
                                        <Row>
                                            <Col>
                                                Classrooms?
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col style={{overflow: 'auto', maxHeight: '6rem'}}>
                                                {classroomsJSX}
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/*Comments filter*/}
                                    <Col xs='12' md='4'>
                                        <Row>
                                            <Col>
                                                Comments?
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                {radioButton('Has', 'comments',
                                                    'has', onRadioButtonClicked, filterData)}

                                                {radioButton('Does not have', 'comments',
                                                    'dontHave', onRadioButtonClicked, filterData)}

                                                {radioButton('All', 'comments',
                                                    'all', onRadioButtonClicked, filterData)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/*Button row*/}
                                <Row className='justify-content-end'>
                                    <Col xs='auto'>
                                        <Button onClick={onResetFilter}>
                                            Reset filter
                                        </Button>
                                    </Col>

                                    <Col xs='auto'>
                                        <Button onClick={onApplyFilter}>
                                            Apply filter
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Collapse>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
}

/*TODO: make this accept one object*/
function radioButton(text: string, name: string, value: string, onChange: (e: any)=>void, filterData: FilterResult)
    : React.ReactElement
{
    // @ts-ignore
    const checked = filterData[name] === value;

    return (
        <Row>
            <Col xs='auto'>
                <Input type='radio' name={name} style={{marginLeft: 0}} onClick={onChange}
                       value={value} checked={checked}
                />{' '}
            </Col>
            <Col>
                {text}
            </Col>
        </Row>
    )
}

/*TODO: make this accept one object*/
function checkBox(text: string, value: string, onChange: (e: any)=>void, filterData: FilterResult)
{

    const checked = filterData.classrooms.findIndex(value1 => value1 === value) !== -1;

    return (
        <Row>
            <Col xs='auto'>
                <Input type='checkbox' style={{marginLeft: 0}} value={value} onChange={onChange} checked={checked}/>
            </Col>
            <Col>
                {text}
            </Col>
        </Row>
    )
}

function dropArrow(isOpen: boolean): React.ReactElement
{
    const rotationDeg = isOpen ? 180 : 0;
    return (
        <FontAwesomeIcon icon={faCaretDown}
                         style=
                             {{
                                 transition: 'transform 224ms',
                                 transform: `rotate(${rotationDeg}deg)`
                             }}/>
    );
}
